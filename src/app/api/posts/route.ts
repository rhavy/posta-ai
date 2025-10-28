// pages/api/posts.ts
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";

/**
 * GET /api/posts
 * Retorna todos os posts com o autor
 */
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, image: true, email: true },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return new NextResponse("Erro ao buscar posts", { status: 500 });
  }
}

/**
 * POST /api/posts
 * Cria um novo post (requer autenticação via Better Auth)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 });
    }

    const data = await req.formData();
    const title = data.get("title") as string;
    const content = data.get("content") as string;
    const imagePosition = data.get("imagePosition") as string | null;
    const titleAlignment = data.get("titleAlignment") as string | null;
    const image = data.get("image") as File | null;

    let imageUrl: string | undefined;

    // Upload de imagem para /public/posts
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const imageName = `${Date.now()}-${image.name}`;
      const path = join(process.cwd(), "public", "posts", imageName);
      await writeFile(path, buffer);
      imageUrl = `/posts/${imageName}`;
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        image: imageUrl,
        imagePosition,
        titleAlignment,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Erro ao criar post", { status: 500 });
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { search } = req.query;

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: String(search) } },
        { author: { name: { contains: String(search) } } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  res.status(200).json(posts);
}
