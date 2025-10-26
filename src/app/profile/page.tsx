"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Sidebar } from "@/components/template/sidebar/page";
import ProfileContent from './_components/ProfileContent';

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.emailVerified === false) redirect("/invalidUser");

  const [perfil, pessoal, user] = await Promise.all([
    prisma.perfil.findUnique({ where: { userId: session.user.id } }),
    prisma.pessoal.findUnique({ where: { userId: session.user.id } }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
  ]);

  return (
    <>
      <Sidebar />
      <ProfileContent session={session} perfil={perfil} pessoal={pessoal} user={user} />
    </>
  );
}
