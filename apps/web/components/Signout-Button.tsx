"use client";
import React from "react";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import router from "next/router";

function SignoutButton() {
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };
  return <Button onClick={handleSignOut}>Sign Out</Button>;
}

export default SignoutButton;
