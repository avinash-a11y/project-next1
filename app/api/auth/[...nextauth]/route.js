import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/db";

// ✅ 1. Export authOptions
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials || !credentials.phone || !credentials.password) return null;
        let existingUser;
        try{
           existingUser = await prisma.user.findFirst({
            where: { number: credentials.phone }
          });
        }catch(e){
          console.log(e)
        }
        

        if (existingUser) {
          const isValid = await bcrypt.compare(credentials.password, existingUser.password);
          if (isValid) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.number
            };
          }
          return null;
        }

        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        try {
          const newUser = await prisma.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword
            },
          });

          await prisma.balance.create({
            data: {
              userId: newUser.id,
            },
          });

          return {
            id: newUser.id.toString(),
            name: newUser.name,
            email: newUser.number,
          };
        } catch (error) {
          console.error("User creation error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect() {
      return "http://localhost:3000/dashboard";
    },
  },
};

// ✅ 2. Create and export handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };