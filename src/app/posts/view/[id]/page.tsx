import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Sidebar } from "@/components/template/sidebar/page";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import VoltarButton from "../../_components/voltar-button";
import { ViewPostPageProps } from './../../_components/type';

export default async function ViewPostPage({ params, searchParams }: ViewPostPageProps) {
  const { id } = params;
  const page = `/${searchParams?.page}`; // fallback caso não venha

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const post = await prisma.post.findUnique({ where: { id }, });

  if (!post) redirect(page);

  return (
    <>
      <Sidebar />
      <main className="p-4 sm:ml-14 overflow-x-hidden min-h-screen bg-slate-50">
        <header className="h-14 flex items-center justify-between px-4 bg-white border-b mb-4">
          <h1 className="text-lg font-medium text-slate-700">Visualizar Post</h1>
        </header>

        <section className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
          {/* 🔙 Botão client-side */}
          <VoltarButton page={page}/>

          <h2
            className={`text-3xl font-bold mb-4 text-slate-800 ${
              post.titleAlignment === "center" ? "text-center" : "text-left"
            }`}
          >
            {post.title}
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Publicado em: {format(new Date(post.createdAt), "dd/MM/yyyy 'às' HH:mm")}
          </p>

          <div
            className={`flex flex-col ${
              post.imagePosition === "left" ? "sm:flex-row" : ""
            } ${post.imagePosition === "right" ? "sm:flex-row-reverse" : ""}`}
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className={`w-full h-80 object-cover rounded-md mb-6 ${
                  post.imagePosition === "left" || post.imagePosition === "right"
                    ? "sm:w-1/2 sm:h-auto sm:mb-0"
                    : ""
                }`}
              />
            )}
            <div
              className="p-3 prose max-w-none text-slate-700 flex-1"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>
        </section>
      </main>
    </>
  );
}
