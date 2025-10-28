import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Sidebar } from "@/components/template/sidebar/page";
import PostsCreate from "./_components/CreatePostForm";
import { prisma } from "@/lib/prisma";
import ClientPosts from "./_components/ClientPosts";


export default async function PostsCreatePage() {
  // Server-side
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  else if (session.user.emailVerified === false) redirect("/invalidUser");

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
          <h1 className="text-lg font-medium">✍️ Criar novo post</h1>
        </header>

        <section className="max-w-3xl mx-auto mt-8">
          <PostsCreate />
        </section>

        <section className="max-w-full mx-auto mt-8 space-y-6">
          <ClientPosts posts={posts} />
        </section>



      </main>
    </>
  );
}
