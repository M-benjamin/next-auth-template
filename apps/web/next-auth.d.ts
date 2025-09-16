import { Role } from "@prisma/client";
import { type DefaultSession } from "next-auth";

export type ExtendUser = DefaultSession["user"] & {
  role: Role;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendUser;
  }
}
