"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import VoltarButton from "@/app/posts/_components/voltar-button";

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  image?: string | null;
  imagePosition?: "left" | "right" | "center" | null;
  titleAlignment?: "center" | "left" | null;
  createdAt: string | Date;
}

interface Props {
  post: Post;
  page: string;
}

export default function ViewPostContent({ post, page }: Props) {
  return (
    <main className="min-h-screen bg-slate-50 p-4">
      {/* Cabeçalho fixo */}
      <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 p-3"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Visualizar Post</h1>
                <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                    Veja os detalhes completos deste post da comunidade, incluindo imagem, conteúdo e data de publicação.
                    deixe tambem seu comentário e compartilhe com outros membros!
                </p>
              </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-slate-100"
      >
        <div className="flex items-center justify-between mb-6">
          <VoltarButton page={page} />
          <p className="text-xs sm:text-sm text-slate-500">
            Publicado em:{" "}
            <span className="font-medium text-slate-600">
              {format(new Date(post.createdAt), "dd/MM/yyyy 'às' HH:mm")}
            </span>
          </p>
        </div>

        <h2
          className={`text-3xl sm:text-4xl font-bold mb-6 text-slate-800 ${
            post.titleAlignment === "center" ? "text-center" : "text-left"
          }`}
        >
          {post.title}
        </h2>

        <div
          className={`flex flex-col gap-6 ${
            post.imagePosition === "left"
              ? "sm:flex-row"
              : post.imagePosition === "right"
              ? "sm:flex-row-reverse"
              : ""
          }`}
        >
          {/* Imagem principal */}
          {post.image && (
            <motion.img
              src={post.image}
              alt={post.title}
              className={`rounded-xl object-cover shadow-sm border border-slate-200 mx-auto ${
                post.imagePosition === "left" || post.imagePosition === "right"
                  ? "sm:w-1/2 sm:max-h-[500px]"
                  : "w-full max-h-[400px]"
              }`}
              style={{
                aspectRatio:
                  post.imagePosition === "left" || post.imagePosition === "right"
                    ? "4/3"
                    : "16/9",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Conteúdo */}
          <motion.div
            className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-justify flex-1"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          />
        </div>
      </motion.section>
    </main>
  );
}
