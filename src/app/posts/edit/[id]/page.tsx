import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Sidebar } from "@/components/template/sidebar/page";
import { prisma } from "@/lib/prisma";
import EditPostForm from "./_components/EditPostForm";
import { ViewPostPageProps } from './../../_components/type';

export default async function EditPostPage({ params, searchParams }: ViewPostPageProps) {
  const page = `/${searchParams?.page}`; // fallback caso não venha
  const resolvedParams = await Promise.resolve(params);
  const postId = resolvedParams.id;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const post = await prisma.post.findUnique({
    where: { id: postId, authorId: session.user.id },
  });

  if (!post) {
    redirect(page);
  }

  return (
    <>
      <Sidebar />
      <main className="p-4 sm:ml-14 overflow-x-hidden">
        <header className="h-14 flex items-center px-4 bg-white border-b mb-4">
          <h1 className="text-lg font-medium">✍️ Editar Post</h1>
        </header>

        <section className="max-w-3xl mx-auto mt-8">
          <EditPostForm post={post} link={page}/>
        </section>
      </main>
    </>
  );
}
