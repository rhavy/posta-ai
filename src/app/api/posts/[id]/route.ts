import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return new NextResponse("Post não encontrado", { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return new NextResponse("Erro ao buscar post", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const data = await req.formData();
    const title = data.get("title") as string;
    const content = data.get("content") as string;
    const imagePosition = data.get("imagePosition") as string | null;
    const titleAlignment = data.get("titleAlignment") as string | null;
    const image = data.get("image") as File | null;

    let imageUrl: string | undefined;

    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const imageName = `${Date.now()}-${image.name}`;
      const path = join(process.cwd(), "public", "posts", imageName);
      await writeFile(path, buffer);
      imageUrl = `/posts/${imageName}`;
    }

    const updateData: any = { title, content, imagePosition, titleAlignment };
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    await prisma.post.update({
      where: { id },
      data: updateData,
    });

    return new Response("Post atualizado com sucesso!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Erro ao atualizar post", { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // await para Next.js 15+
    const { id } = await context.params;

    await prisma.post.delete({
      where: { id },
    });

    return new Response("Post deletado com sucesso!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Erro ao deletar post", { status: 500 });
  }
}
