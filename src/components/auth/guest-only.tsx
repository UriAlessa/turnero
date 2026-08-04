import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function GuestOnly({ children }: { children: ReactNode }) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return children;
}
