// app/admin/dashboard/page.jsx (Server Component)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
  const token =  cookies().get("token")?.value;

  if (!token) redirect("/admin");

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    
  } catch (err) {
    redirect("/admin");
  }

  return <DashboardClient user={user} />;
}
