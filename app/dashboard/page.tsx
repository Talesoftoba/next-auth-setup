// app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(); // works with default NextAuth setup

  console.log("Dashboard session:", session);

  if (!session) {
    redirect("/login"); // redirect if not logged in
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {session.user?.email}!</p>
      {/* Add more dashboard content here */}
    </div>
  );
}