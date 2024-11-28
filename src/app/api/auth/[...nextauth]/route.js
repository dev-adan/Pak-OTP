import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { logger } from '@/lib/logger';

export const authOptions = {
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
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            logger.warn('Login attempt without email or password');
            throw new Error('Please provide both email and password');
          }

          await connectDB();

          // Find user by email
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            logger.warn(`Login attempt with non-existent email: ${credentials.email}`);
            throw new Error('No user found with this email');
          }

          // Check password
          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordMatch) {
            logger.warn(`Failed login attempt for user: ${credentials.email}`);
            throw new Error('Invalid password');
          }

          logger.info(`Successful login for user: ${credentials.email}`);
          return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          logger.error(`Authentication error: ${error.message}`);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          await connectDB();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user if doesn't exist
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              role: 'user',
              // For Google auth users, we don't store password
              password: await bcrypt.hash(Math.random().toString(36), 12)
            });
            logger.info(`New user created via Google OAuth: ${user.email}`);
            return true;
          }
          logger.info(`Successful Google OAuth login for user: ${user.email}`);
          return true;
        } catch (error) {
          logger.error(`Google OAuth error: ${error.message}`);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      // If it's a Google login, fetch user from DB to get role
      if (account?.provider === 'google') {
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser._id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
