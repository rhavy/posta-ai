"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JSX } from "react";

export default function Footer(): JSX.Element {
  const reduce = useReducedMotion();

  // Animações condicionalmente reduzidas
  const titleAnimation = reduce
    ? {}
    : { initial: { y: -30, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.8 } };

  const descAnimation = reduce
    ? {}
    : { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.3, duration: 0.8 } };

  const buttonsAnimation = reduce
    ? {}
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.6, duration: 0.8 } };

  return (
    <footer
      role="contentinfo"
      aria-labelledby="contact-heading"
      className="relative text-center py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-gray-900 overflow-hidden"
    >
      {/* Subtle decorative radial background */}
      <div
        className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),transparent)] animate-pulse-slow"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          id="contact-heading"
          className="text-3xl md:text-4xl font-extrabold mb-4 text-white drop-shadow-lg"
          {...titleAnimation}
        >
          Pronto para começar?
        </motion.h2>

        <motion.p
          className="text-base md:text-lg mb-8 text-white/90 max-w-2xl mx-auto"
          {...descAnimation}
        >
          Crie sua conta no Posta-AI e comece a compartilhar conteúdos incríveis com a comunidade!
        </motion.p>

        <motion.div className="flex justify-center gap-4 flex-wrap" {...buttonsAnimation}>
          <Link href="/login" aria-label="Ir para Login ou Cadastro">
            <Button
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30"
              aria-label="Login ou Cadastro"
            >
              Login / Cadastro
            </Button>
          </Link>

          <Link href="#sobre" aria-label="Saiba mais sobre o Posta-AI">
            <Button
              variant="outline"
              className="text-blue-600 border-white hover:bg-white/10 px-6 py-3 text-lg font-semibold transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30"
              aria-label="Saiba mais"
            >
              Saiba Mais
            </Button>
          </Link>
        </motion.div>

        {/* Links úteis */}
        <nav className="mt-8 flex justify-center gap-6 flex-wrap" aria-label="Links úteis">
          <Link href="/sobre" className="text-sm text-white/80 hover:text-white transition-colors focus:outline-none focus:underline">
            Sobre
          </Link>
          <Link href="/blog" className="text-sm text-white/80 hover:text-white transition-colors focus:outline-none focus:underline">
            Blog
          </Link>
          <Link href="/termos" className="text-sm text-white/80 hover:text-white transition-colors focus:outline-none focus:underline">
            Termos
          </Link>
          <Link href="/privacidade" className="text-sm text-white/80 hover:text-white transition-colors focus:outline-none focus:underline">
            Privacidade
          </Link>
        </nav>

        <p className="mt-6 text-sm text-white/60">
          © {new Date().getFullYear()} Posta-AI. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
