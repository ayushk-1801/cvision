"use server";

import { auth } from "@/lib/auth";

export const signIn = async (email: string, password: string) => {
  await auth.api.signInEmail({
    body: {
      email: email,
      password: password,
    },
  });
};

export const signInWithGoogle = async () => {
  await auth.api.signInSocial({
    body: {
      provider: "google",
    },
  });
};

export const signUp = async (email: string, password: string, name: string) => {
  await auth.api.signUpEmail({
    body: {
      email: email,
      password: password,
      name: name,
    },
  });
};