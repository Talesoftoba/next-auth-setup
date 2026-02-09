import  { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}

