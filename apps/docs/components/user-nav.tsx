"use client"

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { getSession } from "@/server/users";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


type User = {
  name?: string;
  email?: string;
  imageUrl?: string;
};

export function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
    const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        const session = await getSession();
        if (session) {
          setUser(session.user || null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/signin");
          },
        },
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };
  
  // Show loading state or sign in button when not authenticated
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="/signin">Sign in</a>
        </Button>
        <Button size="sm" asChild>
          <a href="/signup">Sign up</a>
        </Button>
      </div>
    );
  }
  
  // User is authenticated, show dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl || "/avatars/01.png"} alt={user.name || "User"} />
            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
