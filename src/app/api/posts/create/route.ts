// src/app/api/posts/create/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    // ✅ Autenticação
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return new Response("Unauthorized", { status: 401 });

    // ✅ Recebe FormData
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imagePosition = formData.get("imagePosition") as string | null;
    const titleAlignment = formData.get("titleAlignment") as string | null;
    const file = formData.get("image") as File | null;

    if (!title || !content) {
      return new Response("Título e conteúdo são obrigatórios", { status: 400 });
    }

    let imageUrl: string | null = null;

    // ✅ Upload da imagem (se houver)
    if (file && file.arrayBuffer) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "posts" },
          (err, result) => {
            if (err || !result?.secure_url) return reject(err || new Error("Upload falhou"));
            resolve({ secure_url: result.secure_url });
          }
        ).end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    // ✅ Salva no banco
    const post = await prisma.post.create({
      data: {
        title,
        content,
        image: imageUrl,
        imagePosition,
        titleAlignment,
        author: { connect: { id: session.user.id } },
      },
    });

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error: any) {
    console.error("Erro ao criar post:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
