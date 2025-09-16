// import { currentUser } from "@clerk/nextjs/server";
import { currentRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const role = await currentRole();

  // > Check the user's role
  // > If role is USER redirect to /
  if (!role || role === "USER") redirect("/");

  // > If role is ADMIN redirect to /admin
  if (role === "ADMIN") redirect("/dashboard/admin");

  // > If role is SELLER redirect to /seller
  if (role === "SELLER") redirect("/dashboard/seller");
}
