"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import db from "@/db/prisma";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

import {
  sendResetEmail,
  sendTwoFactorEmail,
  sendVerificationEmail,
} from "@/lib/mail";
import {
  generatePassswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/token";
import { getUserByEmail } from "@/data/user";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import {
  NewPasswordSchema,
  RegisterSchema,
  ResetEmailSchema,
} from "@/lib/schemas";

import { LoginSchema } from "@/lib/schemas";

import { getVerificationTokenByToken } from "@/data/verification-token";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationById } from "@/data/two-factor-confirmation";
import { signOut } from "@/auth";

/**
 * Authenticates a user and redirects them to the default login redirect URL.
 * @param values The email and password to authenticate with.
 * @returns An object with either an error message or a success message.
 * If the email or password is invalid, an error message is returned.
 * If the user exists but their email is not verified, a success message is returned
 * with a request to check their email for a verification email.
 * If the user does not exist, an error message is returned.
 * If the user exists and their email is verified, the user is signed in and redirected
 * to the default login redirect URL.
 */
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid email or password",
    };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  // > Check if user have password and email for credential authentification
  if (!existingUser || !existingUser.password || !existingUser.email) {
    return {
      error: "User with this email does not exist",
    };
  }

  // > Check if email is verified
  // if (!existingUser.emailVerified) {
  //   // > Generate new verification token
  //   const vericationToken = await generateVerificationToken(existingUser.email);

  //   await sendVerificationEmail(vericationToken.email, vericationToken.token);

  //   return {
  //     success: "Check your email to verify your account",
  //   };
  // }

  //  > Check if two factor authentification  is verified
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    // > FOR TWO FACTOR AUTHENTIFICATION
    if (code) {
      console.log("YES");
      // > Check if code is correct
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return {
          error: "Invalid code",
        };
      }

      if (twoFactorToken.token !== code) {
        return {
          error: "code is not correct",
        };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return {
          error: "Code has expired",
        };
      }

      // > 1 - Delete token two factor
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      // > 2 - get two factor confirmation
      const existingConfirmation = await getTwoFactorConfirmationById(
        twoFactorToken.id
      );

      if (existingConfirmation) {
        // > if find delete it
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      // > 3 - create new two factor confirmation
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    }
    // > END TWO FACTOR
    else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

      return {
        twoFactor: true,
        // success: "Check your email to get your code",
      };
    }
  }

  try {
    await signIn("credentials", {
      // redirect: true,
      email,
      password,
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });

    // console.log(res, "res ===>");
  } catch (error) {
    // console.log(error, "error");
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid email or password",
          };

        case "CallbackRouteError":
          return {
            error: "Something went Wrong!",
          };

        default:
          return {
            error: "Something went wrong",
          };
      }
    }

    throw error;
  }
};

/**
 * Registers a new user with the provided details.
 *
 * @param values - An object containing the user's registration details that
 *                 must conform to the RegisterSchema.
 *
 * @returns An object containing either an error message or a success message.
 *          If registration fails due to invalid data or an existing user,
 *          an error message is returned. If successful, a success message
 *          is returned and a verification email is sent to the user.
 */

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid email or password",
    };
  }

  const { email, password, name } = validatedFields.data;
  const hashPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: "User already exists",
    };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      role: "USER",
    },
  });

  const vericationToken = await generateVerificationToken(email);

  // > Send verification email
  await sendVerificationEmail(vericationToken.email, vericationToken.token);

  return {
    success: "User created successfully",
  };
};

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return {
      error: "Missing token",
    };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return {
      error: "Invalid token",
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      error: "Token has expired",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      error: "Email user do not exist",
    };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  // > CODE HERE
  return {
    success: "Password successfully updated",
  };
};

export const resetEmail = async (values: z.infer<typeof ResetEmailSchema>) => {
  const validatedFields = ResetEmailSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid email",
    };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      error: "Email not found",
    };
  }

  const passwordResetToken = await generatePassswordResetToken(email);

  await sendResetEmail(passwordResetToken.email, passwordResetToken?.token);

  // > CODE HERE
  return {
    success: "Email successfully sent",
  };
};

/**
 * Verifies a user's email by consuming a verification token.
 * @param token The verification token to consume.
 * @returns An object with either an error message or a success message.
 * If the token is invalid, expired, or the user doesn't exist, an error message is returned.
 * If the token is valid and the user exists, their email is marked as verified and the token is deleted.
 * If successful, a success message is returned.
 */
export const emailVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      error: " Token do not exist",
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      error: "Token has expired",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      error: "User do not exist",
    };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingUser.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    success: "Email has been verified",
  };
};

export const logout = async () => {
  // > DO SOMETHING BEFORE LOGOUT
  await signOut();
};
