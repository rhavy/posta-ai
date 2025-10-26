// app/page.tsx
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Hero from "@/components/template/hero";
import Footer from "@/components/template/footer";

export default function Home() {
  // Simulação de feed de posts para preview
  const fakePosts = [
    { title: "Aprendendo Next.js", author: "João", excerpt: "Descubra como criar aplicações modernas com Next.js e Tailwind..." },
    { title: "Prisma + MySQL", author: "Maria", excerpt: "Integre seu banco de dados com Prisma e MySQL de forma eficiente..." },
    { title: "shadcn/ui Components", author: "Carlos", excerpt: "Construa interfaces bonitas e consistentes usando shadcn/ui..." },
  ];

  return (
    <div className="font-sans">
      {/* Hero Premium */}

      <Hero />

      {/* Sobre */}
      <section id="sobre" className="max-w-5xl mx-auto py-20 px-4 text-center">
        <motion.h2
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-6"
        >
          Sobre o Projeto
        </motion.h2>
        <motion.p
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gray-700 text-lg max-w-3xl mx-auto"
        >
          O Posta-AI é uma plataforma moderna de blogs e interações sociais. Permite que usuários publiquem, comentem e compartilhem conteúdos de maneira intuitiva. Desenvolvido com Next.js, Tailwind CSS, Prisma e shadcn/ui, oferece alta performance e responsividade.
        </motion.p>
      </section>

      {/* Funcionalidades com animação */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Feed de Posts", color: "bg-blue-500", icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ), description: "Visualize posts em ordem cronológica, busque por título ou autor, e acompanhe os conteúdos mais recentes."
              },
              {
                title: "Área do Usuário", color: "bg-green-500", icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M12 7a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ), description: "Crie, edite e exclua seus posts, com acesso à sua lista de comentários e perfil personalizado."
              },
              {
                title: "Interatividade", color: "bg-purple-500", icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.265 0-2.454-.256-3.537-.724L3 20l1.724-5.463A7.961 7.961 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ), description: "Comente em posts de outros usuários, interaja com conteúdos e construa sua presença na plataforma."
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
              >
                <Card className="hover:scale-105 transition-transform shadow-lg hover:shadow-2xl">
                  <CardHeader className="flex items-center gap-3">
                    <div className={`${item.color} text-white p-3 rounded-full`}>{item.icon}</div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-700">{item.description}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview de posts animado */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Preview do Feed</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fakePosts.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
            >
              <Card className="shadow-lg hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-gray-500">por {post.author}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{post.excerpt}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Final */}
      <Footer />
    </div>
  );
}
