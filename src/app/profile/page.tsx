"use server";

import { prisma } from "@/lib/prisma";
import { ProfileBanner } from "./_components/ProfileBanner";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Sidebar } from "@/components/template/sidebar/page";
import { InputAutoSalve } from "./_components/InputAutoSalve";
import { buscarEnderecoPorCep } from "@/lib/utils";
import { EnderecoSection } from "./_components/endereço";

export default async function ProfilePage() {
  // --- Autenticação do usuário ---
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.emailVerified === false) redirect("/invalidUser");

  // --- Busca dados do banco ---
  const [perfil, pessoal, user] = await Promise.all([
    prisma.perfil.findUnique({
      where: { userId: session.user.id },
      select: {
        rua: true,
        numero: true,
        referencia: true,
        bairro: true,
        cidade: true,
        estado: true,
        pais: true,
        cep: true,
      },
    }),
    prisma.pessoal.findUnique({
      where: { userId: session.user.id },
      select: { telefone: true, celular: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        banner: true,
        bio: true,
        cpf: true,
        rg: true,
        dataNascimento: true,
        email: true,
        genero: true,
        image: true,
        name: true,
      },
    }),
  ]);

  // --- Define imagens padrão ---
  const imageUrl = session.user?.image || "/avatar-placeholder.png";
  const imageBanner = user?.banner || "/images/banner1.jpg";

  // --- Renderização ---
  return (
    <>
      <Sidebar />
      <main className="w-full bg-gray-50 min-h-screen py-8 px-4 sm:px-6 md:px-10 lg:px-24">
        <header className="h-14 flex items-center px-4 bg-white border-b mb-4">
          <h1 className="text-lg font-medium">Perfil</h1>
        </header>

        <div className="max-w-full mx-auto space-y-10">
          {/* Banner */}
          <ProfileBanner
            imageBanner={imageBanner}
            imageUrl={imageUrl}
            name={`${user?.name ?? "Nome não informado"}`}
            email={user?.email || "sem E-mail cadastrado"}
          />

          {/* Biografia */}
          <InputAutoSalve
            userId={session.user.id}
            valorInicial={user?.bio || "Sem biografia definida."}
            label="Biografia"
            nome="Top"
            campo="bio"
            tabela="User"
            tipo="textarea"
            cad={true}
            tamanho="w-full"
          />

          {/* Pessoal */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 px-2 lg:px-0">
              Pessoal
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputAutoSalve
                userId={session.user.id}
                valorInicial={pessoal?.telefone || ""}
                label="Telefone"
                campo="telefone"
                tabela="Pessoal"
                tipo="text"
                cad={false}
              />

              <InputAutoSalve
                userId={session.user.id}
                valorInicial={pessoal?.celular || ""}
                label="Celular"
                campo="celular"
                tabela="Pessoal"
                tipo="text"
                cad={false}
              />

              <InputAutoSalve
                userId={session.user.id}
                valorInicial={
                  user?.dataNascimento
                    ? new Date(user.dataNascimento).toISOString().split("T")[0]
                    : ""
                }
                label="Nascimento"
                campo="dataNascimento"
                tabela="User"
                tipo="date"
                cad={false}
              />

              <InputAutoSalve
                userId={session.user.id}
                valorInicial={user?.genero || ""}
                label="Gênero"
                campo="genero"
                tabela="User"
                tipo="select"
                cad={false}
              />

            </div>
          </section>
            <EnderecoSection userId={session.user.id} perfil={perfil} />
              
        </div>
      </main>
    </>
  );
}
