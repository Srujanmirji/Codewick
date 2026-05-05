import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          onboardingComplete: user.onboardingComplete,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      // If signing in via OAuth, we need to create the user in our DB if they don't exist
      if (account?.provider === "google") {
        await connectToDatabase();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              onboardingComplete: false,
            });
            // Attach DB id and onboarding status to the user object for JWT
            (user as any).id = newUser._id.toString();
            (user as any).onboardingComplete = false;
          } else {
            if (user.image && existingUser.image !== user.image) {
              existingUser.image = user.image;
              await existingUser.save();
            }
            (user as any).id = existingUser._id.toString();
            (user as any).onboardingComplete = existingUser.onboardingComplete;
          }
          return true;
        } catch (error) {
          console.error("Error saving Google user", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in, copy user fields to the token
      if (user) {
        token.id = (user as any).id;
        token.onboardingComplete = (user as any).onboardingComplete ?? false;
      }
      // Allow manual session refresh after onboarding completion
      if (trigger === "update" && session?.onboardingComplete) {
        token.onboardingComplete = session.onboardingComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).onboardingComplete = token.onboardingComplete ?? false;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow URLs on the same host
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
