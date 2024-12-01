import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Session from '@/models/Session';
import bcrypt from 'bcryptjs';
import { logger } from '@/lib/logger';
import { UAParser } from 'ua-parser-js';
import { headers } from 'next/headers';
import { validateToken, createSession, getLatestSession } from '@/lib/sessionUtils';

const SESSION_HARD_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const SESSION_SOFT_EXPIRY = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

const isSessionExpiringSoon = (session) => {
  const now = new Date();
  const lastAccessed = new Date(session.lastAccessed);
  const timeDiff = now - lastAccessed;
  return timeDiff > SESSION_SOFT_EXPIRY;
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDB();

          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          
          if (!user) {
            logger.warn(`Login attempt failed: User not found - ${credentials.email}`);
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
          
          if (!isValid) {
            logger.warn(`Login attempt failed: Invalid password - ${credentials.email}`);
            return null;
          }

          // Update last login
          await User.findByIdAndUpdate(user._id, {
            lastLogin: new Date()
          });

          logger.info(`User logged in successfully: ${credentials.email}`);
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            tokenVersion: user.tokenVersion
          };
        } catch (error) {
          logger.error(`Authorization error: ${error.message}`);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        // Initial sign in
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.tokenVersion = user.tokenVersion;
        
        // Get the latest session for this user
        const session = await getLatestSession(user.id);
        if (session) {
          token.sessionId = session._id.toString();
        }
      }

      return token;
    },

    async session({ session, token }) {
      try {
        await connectDB();
        
        if (!token?.id) {
          logger.warn('No user ID in token - Session expired or invalid');
          return {
            expires: new Date(0).toISOString(),
            user: null,
            error: 'SESSION_EXPIRED'
          };
        }

        // Enhanced session validation
        const isValid = await validateToken(token, token.sessionId);
        if (!isValid) {
          logger.warn(`Invalid session detected for user: ${token.email}`, {
            tokenId: token.id,
            sessionId: token.sessionId,
            timestamp: new Date().toISOString()
          });
          return {
            expires: new Date(0).toISOString(),
            user: null,
            error: 'SESSION_INVALID'
          };
        }

        // If we don't have a sessionId in token, get the latest session
        if (!token.sessionId) {
          const latestSession = await getLatestSession(token.id);
          if (latestSession) {
            token.sessionId = latestSession._id.toString();
            
            // Check if session is expiring soon
            if (isSessionExpiringSoon(latestSession)) {
              logger.warn(`Session expiring soon for user: ${token.email}`, {
                sessionId: latestSession._id,
                lastAccessed: latestSession.lastAccessed
              });
            }
          } else {
            return {
              expires: new Date(0).toISOString(),
              user: null,
              error: 'NO_ACTIVE_SESSION'
            };
          }
        }

        const updatedSession = {
          ...session,
          user: {
            id: token.id,
            email: token.email,
            name: token.name,
            role: token.role
          },
          sessionId: token.sessionId,
          expiresAt: new Date(Date.now() + SESSION_HARD_EXPIRY).toISOString(),
          warnExpiry: isSessionExpiringSoon(await Session.findById(token.sessionId))
        };

        return updatedSession;
      } catch (error) {
        logger.error(`Session validation error`, {
          error: error.message,
          stack: error.stack,
          tokenId: token?.id,
          timestamp: new Date().toISOString()
        });
        return {
          expires: new Date(0).toISOString(),
          user: null,
          error: 'INTERNAL_ERROR'
        };
      }
    },

    async signIn({ user }) {
      try {
        const headersList = await headers();
        const userAgent = headersList.get('user-agent') || '';
        const parser = new UAParser(userAgent);
        
        const deviceInfo = {
          browser: parser.getBrowser().name || 'Unknown',
          os: parser.getOS().name || 'Unknown',
          device: parser.getDevice().type || 'desktop'
        };

        // Create new session with token timestamp
        const session = await createSession(user.id, deviceInfo);
        if (!session) {
          throw new Error('Failed to create session');
        }

        // Don't modify the user object directly
        return true;
      } catch (error) {
        logger.error(`SignIn callback error: ${error.message}`);
        return false;
      }
    }
  },
  events: {
    async signOut({ token }) {
      try {
        logger.info('SignOut event triggered', { token });
        await connectDB();
        
        // Only deactivate the current session
        if (token?.sessionId) {
          logger.info(`Deactivating session: ${token.sessionId}`);
          await Session.findByIdAndUpdate(token.sessionId, {
            isActive: false,
            deactivatedAt: new Date(),
            deactivatedBy: token.sub // token.sub contains the user ID
          });
          logger.info(`Session ${token.sessionId} deactivated for user: ${token.email}`);
        } else {
          logger.warn('No sessionId found in token during signOut');
        }
      } catch (error) {
        logger.error(`Error in signOut event: ${error.message}`);
      }
    }
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
