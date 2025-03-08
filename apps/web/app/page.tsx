import SignoutButton from "@/components/Signout-Button";
import { auth } from "@/lib/auth";
import { prisma } from "@repo/database";
import { headers } from "next/headers";

export default async function IndexPage() {

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
