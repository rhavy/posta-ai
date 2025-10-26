"use client";

import { motion } from "framer-motion";
import { InputAutoSalve } from "./InputAutoSalve";
import { ProfileBanner } from "./ProfileBanner";
import { EnderecoSection } from "./endereço";

export default function ProfileContent({ session, perfil, pessoal, user }: any) {
  
  const imageUrl = session.user?.image || "/avatar-placeholder.png";
  const imageBanner = user?.banner || "/images/banner1.jpg";

  const sectionVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="w-full bg-gray-50 min-h-screen py-10 px-4 sm:px-6 md:px-12 lg:px-24">
      <header className="h-16 flex items-center px-6 bg-white border-b shadow-sm mb-8 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
      </header>

      <motion.div
        className="max-w-full mx-auto space-y-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={sectionVariant}>
          <ProfileBanner
            imageBanner={imageBanner}
            imageUrl={imageUrl}
            name={user?.name ?? "Nome não informado"}
            email={user?.email || "Sem e-mail cadastrado"}
          />
        </motion.div>

        <motion.div variants={sectionVariant}>
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
        </motion.div>

        <motion.section
          variants={sectionVariant}
          className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 transition-transform hover:scale-[1.01]"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 px-2 lg:px-0">
            Informações Pessoais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
            <InputAutoSalve
              nome="Top"
              userId={session.user.id}
              valorInicial={pessoal?.telefone || ""}
              label="Telefone"
              campo="telefone"
              tabela="Pessoal"
              tipo="text"
              cad={false}
            />

            <InputAutoSalve
              nome="Top"
              userId={session.user.id}
              valorInicial={pessoal?.celular || ""}
              label="Celular"
              campo="celular"
              tabela="Pessoal"
              tipo="text"
              cad={false}
            />

            <InputAutoSalve
              nome="Top"
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
              nome="Top"
              userId={session.user.id}
              valorInicial={user?.genero || ""}
              label="Gênero"
              campo="genero"
              tabela="User"
              tipo="select"
              cad={false}
            />
          </div>
        </motion.section>


        <motion.div variants={sectionVariant}>
          <EnderecoSection userId={session.user.id} perfil={perfil} />
        </motion.div>
      </motion.div>
    </main>
  );
}
