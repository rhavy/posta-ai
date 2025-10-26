"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { GoogleLogoIcon } from "@phosphor-icons/react"
import { authClient } from "@/lib/auth-client"
import Cookies from 'js-cookie';

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [timer, setTimer] = useState(0)
  const [shake, setShake] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const {
    formState: { errors },
    reset,
  } = form

  // 🔄 Recupera tentativas salvas em cookies ao carregar
  useEffect(() => {
    const savedAttempts = Cookies.get("login_attempts")
    const blockedUntil = Cookies.get("login_blocked_until")

    if (savedAttempts) setAttempts(Number(savedAttempts))

    if (blockedUntil) {
      const remaining = Math.floor(
        (Number(blockedUntil) - Date.now()) / 1000
      )
      if (remaining > 0) {
        setIsBlocked(true)
        setTimer(remaining)
        setErrorMessage(
          "Muitas tentativas incorretas. Aguarde " + remaining + "s para tentar novamente."
        )
      } else {
        Cookies.remove("login_attempts")
        Cookies.remove("login_blocked_until")
      }
    }
  }, [])

  // ⏱️ Temporizador regressivo
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isBlocked && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1)
      }, 1000)
    } else if (isBlocked && timer === 0) {
      setIsBlocked(false)
      setAttempts(0)
      setErrorMessage(null)
      Cookies.remove("login_attempts")
      Cookies.remove("login_blocked_until")
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isBlocked, timer])

  async function onSubmit(formData: LoginFormValues) {
    if (isBlocked) return

    setIsLoading(true)
    setErrorMessage(null)

    try {      
      await authClient.signIn.email(
        {
          email: formData.email,
          password: formData.password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            // ✅ Sucesso: limpa cookies
            Cookies.remove("login_attempts")
            Cookies.remove("login_blocked_until")
            router.replace("/dashboard")
          },
          onError: (ctx) => {
            if (ctx.error.code === "INVALID_EMAIL_OR_PASSWORD") {
              const newAttempts = attempts + 1
              setAttempts(newAttempts)
              Cookies.set("login_attempts", String(newAttempts), { expires: 1 }) // expira em 1 dia
              setErrorMessage("Usuário ou senha inválido. Verifique suas credenciais.")
              reset({ email: "", password: "" })

              // 💢 Animação shake
              setShake(true)
              setTimeout(() => setShake(false), 500)

              if (newAttempts >= 3) {
                const blockedUntil = Date.now() + 30 * 1000 // 30 segundos
                setIsBlocked(true)
                setTimer(30)
                setErrorMessage("Muitas tentativas incorretas. Aguarde 30 segundos para tentar novamente.")
                Cookies.set("login_blocked_until", String(blockedUntil), { expires: 1 })
              }
            }
          },
        }
      )
    } catch (err) {
      console.error("Erro ao autenticar:", err)
      setErrorMessage("Erro inesperado ao tentar entrar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignInWithGoogle() {
    if (isBlocked) return

    setIsLoadingGoogle(true)
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })
    } catch (err) {
      console.error("Erro ao entrar com Google:", err)
    } finally {
      setIsLoadingGoogle(false)
    }
  }

  return (
    <>
      {/* 🔥 CSS local */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }

        @keyframes blink {
          50% { opacity: 0.6; }
        }

        .animate-shake { animation: shake 0.4s ease; }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`space-y-6 transition-all duration-300 ${shake ? "animate-shake" : ""}`}
        >
          {/* Mensagem de erro global */}
          {errorMessage && (
            <div
              className={`p-3 rounded-lg border text-sm text-center ${isBlocked
                  ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
            >
              {errorMessage}
              {!isBlocked && attempts > 0 && (
                <p className="text-xs text-slate-400 mt-1">
                  Tentativa {attempts} de 3
                </p>
              )}
              {isBlocked && (
                <p className="text-xs text-slate-400 mt-1 animate-blink">
                  Aguarde {timer}s para tentar novamente.
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-200">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="voce@exemplo.com"
                    disabled={isLoading || isBlocked}
                    className={`bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 ${errors.email
                        ? "border border-red-500 focus:ring-red-500"
                        : "border border-blue-300/30 focus:ring-blue-400"
                      }`}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Senha */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-200">Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      disabled={isLoading || isBlocked}
                      className={`bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 ${errors.password
                          ? "border border-red-500 focus:ring-red-500"
                          : "border border-blue-300/30 focus:ring-blue-400"
                        }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-slate-200 hover:text-slate-50"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading || isBlocked}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Botão principal */}
          <Button
            type="submit"
            className={`w-full font-semibold py-3 rounded-xl transition shadow-md ${isBlocked
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-slate-500 hover:from-blue-600 hover:to-slate-600 text-white"
              }`}
            disabled={isLoading || isBlocked}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
              </>
            ) : isBlocked ? (
              `Bloqueado (${timer}s)`
            ) : (
              "Entrar"
            )}
          </Button>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full border border-blue-400/30 text-blue-400 hover:bg-blue-500/20"
            onClick={handleSignInWithGoogle}
            disabled={isLoadingGoogle || isBlocked}
          >
            {isLoadingGoogle ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> <GoogleLogoIcon className="mr-2 h-4 w-4" /> Entrando...
              </>
            ) : isBlocked ? (
              `Bloqueado (${timer}s)`
            ) : (
              <>
                <GoogleLogoIcon className="mr-2 h-4 w-4" />
                Entrar com Google
              </>
            )}

          </Button>
        </form>
      </Form>
    </>
  )
}
