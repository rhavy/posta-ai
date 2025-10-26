"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // largura da janela (somente no client)
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth); // só aqui usamos window
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // scroll listener
  useEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  // mouse listener
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  // transforma scroll
  const blob1Y = useTransform(scrollY, [0, 500], [0, -50]);
  const blob2Y = useTransform(scrollY, [0, 500], [0, 80]);
  const blob3Y = useTransform(scrollY, [0, 500], [0, -30]);
  const blob4Y = useTransform(scrollY, [0, 500], [0, 60]);

  // transforma mouse (só se windowWidth estiver definido)
  const blob1X = useTransform(mouseX, [0, windowWidth || 1], [-30, 30]);
  const blob2X = useTransform(mouseX, [0, windowWidth || 1], [20, -20]);
  const blob3X = useTransform(mouseX, [0, windowWidth || 1], [-15, 15]);
  const blob4X = useTransform(mouseX, [0, windowWidth || 1], [25, -25]);

  return (
    <section className="relative text-center h-[90vh] flex flex-col justify-center items-center overflow-hidden">
      {/* Gradiente animado */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-r from-blue-600 via-blue-700 to-gray-900 animate-gradient-x"></div>

      {/* Blobs */}
      <motion.div style={{ x: blob1X, y: blob1Y }} className="absolute -top-32 -left-32 w-72 h-72 bg-blue-500 rounded-full opacity-30 blur-3xl mix-blend-screen -z-10" />
      <motion.div style={{ x: blob2X, y: blob2Y }} className="absolute -bottom-32 -right-32 w-96 h-96 bg-gray-700 rounded-full opacity-20 blur-3xl mix-blend-screen -z-10" />
      <motion.div style={{ x: blob3X, y: blob3Y }} className="absolute top-1/2 left-1/3 w-60 h-60 bg-blue-400 rounded-full opacity-20 blur-2xl mix-blend-screen -z-10" />
      <motion.div style={{ x: blob4X, y: blob4Y }} className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500 rounded-full opacity-25 blur-3xl mix-blend-screen -z-10" />

      {/* Conteúdo */}
      <motion.h1 initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-2xl text-white">
        Posta-AI
      </motion.h1>
      <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-base md:text-xl mb-10 max-w-3xl mx-auto text-white/90">
        Uma plataforma moderna para{" "}
        <span className="font-semibold bg-gradient-to-r from-blue-300 via-blue-400 to-gray-400 bg-clip-text text-transparent">
          criar, compartilhar e interagir
        </span>{" "}
        com posts.
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex justify-center gap-6 flex-wrap">
        <Link href="/login">
          <Button className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-transform hover:scale-105">
            Login / Cadastro
          </Button>
        </Link>

        <Link href="#sobre">
          <Button variant="outline" className="text-blue-600 border-white hover:bg-white/20 px-6 py-3 text-lg font-semibold transition-transform hover:scale-105">
            Saiba Mais
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
