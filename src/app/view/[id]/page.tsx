import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ViewPostContent from "../_components/ViewPostContent";
import { ViewPostPageProps } from "../_components/types";
import { MenuPage } from "@/components/template/menu/page";

// 🔹 Tipagem completa do Post
interface PostType {
  id: string;
  title: string;
  content: string;
  authorId: string;
  image?: string | null;
  imagePosition?: "left" | "right" | "center" | null;
  titleAlignment?: "center" | "left" | null;
  createdAt: string | Date;
}

// 🔹 Página Server Component
export default async function ViewPostComunidadePage({
  params,
  searchParams,
}: ViewPostPageProps) {
  const { id } = params;
  const page = `/${searchParams?.page || "comunidade"}`;

  // 🔹 Busca o post no banco
  const rawPost = await prisma.post.findUnique({ where: { id } });

  const post: PostType | null = rawPost
    ? {
      ...rawPost,
      // ✅ Faz o cast manual para compatibilizar com a tipagem esperada
      imagePosition: rawPost.imagePosition as
        | "left"
        | "right"
        | "center"
        | null,
      titleAlignment: rawPost.titleAlignment as "center" | "left" | null,
    }
    : null;

  if (!post) {
    redirect(page);
  }

  return (
    <>
      <MenuPage page={"/comunidade"} />
      <ViewPostContent post={post} page={page} />
    </>
  );
}
