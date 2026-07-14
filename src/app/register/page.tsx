import { redirect } from "next/navigation";

export const metadata = { title: "Sign in" };

/** Register is the same as sign-in — OAuth only (Google / X). */
export default function RegisterPage() {
  redirect("/login");
}
