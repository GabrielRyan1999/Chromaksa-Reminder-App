import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientDashboard from "@/components/ClientDashboard";

export default async function AppDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/auth"); 
  }

  return (
    <main className="flex h-screen bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden">
      <ClientDashboard user={session.user} />
    </main>
  );
}
