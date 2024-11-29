import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Session from '@/models/Session';
import bcrypt from 'bcryptjs';
import { logger } from '@/lib/logger';
import { UAParser } from 'ua-parser-js';
import { headers } from 'next/headers';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
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
            role: user.role
          };
        } catch (error) {
          logger.error(`Authorization error: ${error.message}`);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        await connectDB();
        
        // Check if session is still active in database
        const dbSession = await Session.findOne({
          userId: token.id,
          isActive: true
        }).sort({ lastAccessed: -1 });

        if (!dbSession) {
          throw new Error('Session not found or inactive');
        }

        const updatedSession = {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            email: token.email,
            name: token.name,
            role: token.role
          },
          sessionId: dbSession._id.toString()
        };
        
        // Update last accessed time
        await Session.findByIdAndUpdate(dbSession._id, {
          lastAccessed: new Date()
        });

        return updatedSession;
      } catch (error) {
        logger.error(`Session validation error: ${error.message}`);
        return {
          expires: new Date(0).toISOString(),
          user: null
        };
      }
    },
    async signIn({ user }) {
      try {
        await connectDB();
        
        // Get user agent info from the request headers
        const headersList = headers();
        const userAgent = headersList.get('user-agent') || '';
        
        let deviceInfo = {
          browser: 'Unknown',
          os: 'Unknown',
          device: 'Desktop'
        };

        try {
          const parser = new UAParser(userAgent);
          const result = parser.getResult();
          
          deviceInfo = {
            browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
            os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
            device: result.device.type || (
              /mobile/i.test(userAgent) ? 'Mobile' :
              /tablet/i.test(userAgent) ? 'Tablet' : 'Desktop'
            )
          };
        } catch (parseError) {
          logger.warn(`Error parsing user agent: ${parseError.message}`);
        }

        // Create new session
        await Session.create({
          userId: user.id,
          deviceInfo,
          ipAddress: headersList.get('x-forwarded-for') || 'Unknown',
          lastAccessed: new Date(),
          isActive: true
        });

        logger.info(`New session created for user: ${user.email}`);
        return true;
      } catch (error) {
        logger.error(`Error in signIn callback: ${error.message}`);
        return false;
      }
    }
  },
  pages: {
    signIn: '/?showLogin=true',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
