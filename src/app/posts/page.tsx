import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Sidebar } from "@/components/template/sidebar/page";
import { prisma } from "@/lib/prisma";
import PostsList from "./_components/PostsList";

export default async function PostsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      createdAt: true,
    },
  });

  return (
    <>
      <Sidebar />
      <main className="p-4 sm:ml-14 overflow-x-hidden">
        <header className="h-14 flex items-center px-4 bg-white border-b mb-4">
          <h1 className="text-lg font-medium">Meus Posts</h1>
        </header>

        <section className="max-w-full mx-auto mt-8 space-y-6">
          <PostsList posts={posts} />
        </section>
      </main>
    </>
  );
}