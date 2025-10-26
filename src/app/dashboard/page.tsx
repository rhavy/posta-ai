import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Sidebar } from "@/components/template/sidebar/page";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  } else if (session.user.emailVerified === false) {
    redirect("/invalidUser");
  }
 

  return (
    <>
      <Sidebar />
      <main className="p-4 sm:ml-14 overflow-x-hidden">
        <header className="h-14 flex items-center px-4 bg-white border-b mb-4">
          <h1 className="text-lg font-medium">Dashboard</h1>
        </header>
        {/* cards overview */}

        <div className="flex flex-col md:flex-row w-full gap-4">

          {/* bloco esquerdo: cards + charts */}
          <div className="flex flex-col gap-4 w-full md:flex-[3] min-w-0">

            {/* cards overview */}
            

          </div>


        </div>
      </main>

    </>
  )
}