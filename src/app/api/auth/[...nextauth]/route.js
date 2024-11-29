import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from '@/lib/mongodb-adapter'
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Session from '@/models/Session';
import { logger } from '@/lib/logger';

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

          const isValid = await user.comparePassword(credentials.password);
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
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token, user }) {
      try {
        if (session?.user) {
          session.user.id = token?.id || user?.id;
          session.user.role = token?.role || user?.role;
          
          logger.info(`Session updated for user: ${session.user.email}`);
          
          // Update session activity
          await Session.findOneAndUpdate(
            { userId: session.user.id },
            { 
              $set: { 
                lastActivity: new Date(),
                isValid: true
              }
            },
            { upsert: true }
          );
        }
        return session;
      } catch (error) {
        logger.error(`Session callback error: ${error.message}`);
        return session;
      }
    },
    async signIn({ user, account, profile }) {
      try {
        await connectDB();
        logger.info(`Sign in attempt for user: ${user.email}`);
        
        if (account?.provider === 'google') {
          const existingUser = await User.findOne({ email: user.email.toLowerCase() });
          
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email.toLowerCase(),
              role: 'user',
              image: user.image,
              password: await bcrypt.hash(Math.random().toString(36), 12),
              emailVerified: new Date()
            });
            logger.info(`New user created via Google OAuth: ${user.email}`);
          }
        }

        return true;
      } catch (error) {
        logger.error(`Sign in error: ${error.message}`);
        return false;
      }
    }
  },
  session: {
    strategy: "jwt", // Changed to JWT for better compatibility
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/?showLogin=true',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error: (code, ...message) => logger.error(code, { message }),
    warn: (code, ...message) => logger.warn(code, { message }),
    debug: (code, ...message) => logger.debug(code, { message }),
  }
});

export { handler as GET, handler as POST };
