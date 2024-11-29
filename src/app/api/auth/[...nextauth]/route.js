import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from '@/lib/mongodb-adapter';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Session from '@/models/Session';
import { logger } from '@/lib/logger';
import { headers } from 'next/headers';

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          await connectDB();
          logger.info(`Attempting login for email: ${credentials.email}`);
          
          const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');
          if (!user) {
            logger.warn(`Login failed: User not found for email ${credentials.email}`);
            throw new Error('Invalid email or password');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            logger.warn(`Login failed: Invalid password for email ${credentials.email}`);
            throw new Error('Invalid email or password');
          }

          logger.info(`Login successful for user: ${user.email}`);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image
          };
        } catch (error) {
          logger.error(`Authentication error: ${error.message}`);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.sessionId = token.jti; // Use JWT ID as session ID
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (session?.user) {
          session.user.id = token.id;
          session.user.role = token.role;
          session.sessionId = token.sessionId;

          // Get request headers
          const headersList = await headers();
          const userAgent = headersList.get('user-agent') || '';
          const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
                    headersList.get('x-real-ip') || 
                    'unknown';

          // Parse user agent
          const browser = userAgent.match(/(chrome|safari|firefox|edge|opera|ie)\/?\s*(\d+)/i)?.[1] || 'unknown';
          const os = userAgent.match(/windows|mac|linux|android|ios/i)?.[0] || 'unknown';
          const device = userAgent.match(/mobile|tablet/i) ? 'mobile' : 'desktop';

          // Create or update session document
          await connectDB();
          await Session.findOneAndUpdate(
            { 
              sessionToken: token.sessionId,
              userId: session.user.id
            },
            { 
              $set: { 
                lastActivity: new Date(),
                isValid: true,
                deviceInfo: {
                  userAgent,
                  browser,
                  os,
                  device,
                  ip
                }
              }
            },
            { 
              upsert: true,
              new: true
            }
          );

          logger.info(`Session updated for user: ${session.user.email}`);
        }
        return session;
      } catch (error) {
        logger.error(`Session callback error: ${error.message}`);
        return session;
      }
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google') {
          await connectDB();
          const existingUser = await User.findOne({ email: profile.email });
          
          if (!existingUser) {
            const newUser = await User.create({
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              emailVerified: profile.email_verified,
              role: 'user'
            });
            user.id = newUser._id.toString();
            user.role = 'user';
          } else {
            user.id = existingUser._id.toString();
            user.role = existingUser.role;
          }
        }
        return true;
      } catch (error) {
        logger.error(`Sign in callback error: ${error.message}`);
        return false;
      }
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
