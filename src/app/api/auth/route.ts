import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { headers } from "next/headers";

// Função para obter extensão do arquivo
function getExtension(file: File) {
  return file.type.split("/")[1]; // Exemplo: "png"
}

// Valida tipo e tamanho
function isValidImage(file: File) {
  const allowed = ["image/png", "image/jpeg"];
  return allowed.includes(file.type) && file.size <= 5 * 1024 * 1024; // Máx. 5MB
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return NextResponse.redirect("/");

  const formData = await req.formData();
  const avatar = formData.get("avatar") as File;
  const banner = formData.get("banner") as File;

  const uploads: Record<string, string> = {};

  // Diretório de upload para esse usuário
  const uploadDir = path.join(process.cwd(), "public", "uploads", session.user.id);
  await mkdir(uploadDir, { recursive: true });

  async function saveImage(image: File, name: string) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, name);
    await writeFile(filePath, buffer);
    return `/uploads/${session.user.id}/${name}`;
  }

  if (avatar && isValidImage(avatar)) {
    const ext = getExtension(avatar);
    uploads["image"] = await saveImage(avatar, `avatar-${Date.now()}.${ext}`);
  }

  if (banner && isValidImage(banner)) {
    const ext = getExtension(banner);
    uploads["banner"] = await saveImage(banner, `banner-${Date.now()}.${ext}`);
  }

  await auth.api.updateUser(session.user.id, {
    image: uploads["image"] ?? undefined,
    banner: uploads["banner"] ?? undefined,
  });

  return NextResponse.json({
    success: true,
    message: "Upload concluído com sucesso!",
    user: {
      id: session.user.id,
      image: uploads["image"] ?? null,
      banner: uploads["banner"] ?? null,
    },
  });
}
