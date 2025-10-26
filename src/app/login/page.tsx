import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LoginForm } from "./_components/login-form"

export default async function loginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session && session?.user.emailVerified === true) {
    redirect("/dashboard")
  }

  return (
    <main className="relative flex items-center justify-center min-h-screen text-white overflow-hidden">
      {/* 🎥 Fundo com vídeo azul acinzentado (igreja/cidade) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
      >
        <source src="/videos/login.mp4" type="video/mp4" />
      </video>

      {/* Overlay com gradiente azul e cinza suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-slate-800/50 to-blue-900/30"></div>

      {/* Card central */}
      <div className="relative z-10 w-[90%] max-w-md bg-white/10 border border-blue-200/20 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] overflow-hidden">
            Posta AI
          </div>

          <h1 className="text-2xl font-semibold mt-4 text-slate-50">
            Posta AI
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Bem-vindo! Faça login para continuar.
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm mt-6">
          <p className="text-slate-300">
            Não tem uma conta?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-300 hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
