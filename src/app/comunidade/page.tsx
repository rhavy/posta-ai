"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { MenuPage } from "@/components/template/menu/page";

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  imagePosition?: string | null;
  titleAlignment?: string | null;
  author: { name: string; image?: string | null };
  createdAt: string;
}

export default function ComunidadePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Erro ao carregar posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Carregando posts...
      </div>
    );

  return (
    <>
      <MenuPage page={"/comunidade"}/>
      <div className="font-sans max-w-ful mx-auto p-4 py-1">

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 p-3"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Posts da Comunidade</h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Confira as últimas publicações da comunidade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <Card className="shadow-md hover:shadow-xl transition-transform hover:scale-105">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                    style={{ objectPosition: post.imagePosition || "center" }}
                  />
                )}
                <CardHeader
                  className={`${post.titleAlignment === "center"
                      ? "text-center"
                      : post.titleAlignment === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                >
                  <CardTitle className="text-xl font-semibold">{post.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    por {post.author?.name || "Anônimo"}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 line-clamp-3">{post.content}</p>
                  <Link
                    href={`/view/${post.id}?page=comunidade`}
                    className="text-blue-600 mt-2 inline-block hover:underline"
                  >
                    Ler mais
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
