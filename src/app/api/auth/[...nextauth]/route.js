import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { logger } from '@/lib/logger';

const handler = NextAuth({
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
            throw new Error('Please enter an email and password')
          }

          await connectDB();
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            logger.warn(`Login attempt with non-existent email: ${credentials.email}`);
            throw new Error('No user found with this email')
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password)
          if (!passwordMatch) {
            logger.warn(`Failed login attempt for user: ${credentials.email}`);
            throw new Error('Incorrect password')
          }

          logger.info(`Successful login for user: ${credentials.email}`);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          logger.error(`Authentication error: ${error.message}`);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              role: 'user',
              password: await bcrypt.hash(Math.random().toString(36), 12)
            });
            logger.info(`New user created via Google OAuth: ${user.email}`);
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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    }
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        secure: true,
        domain: process.env.NODE_ENV === 'production' ? 'pak-otp.vercel.app' : undefined
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
});

export { handler as GET, handler as POST };
