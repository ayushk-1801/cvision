import SignoutButton from "@/components/Signout-Button";
import { auth } from "@/lib/auth";
import { prisma } from "@repo/database";
import { headers } from "next/headers";

export default async function IndexPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Hello World</h1>
      <p>{!session ? "Not authenticated" : session.user.name}</p>
      <pre>{JSON.stringify(users, null, 2)}</pre>
      <SignoutButton />
    </div>
  );
}
