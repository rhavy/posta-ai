"use client"

import React, { useEffect, useState } from "react"
import { User2 } from "lucide-react"
import CardUniversal from "./card/cardUniversal"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar" // ✅ Certifique-se de que esse caminho está correto

interface Membro {
  id: string
  cpf: string
  uncao: string
  uncaoVerified: string
  name: string
  image: string
  genero: string
  dataNascimento: string
  createdAt: string // ✅ Mantido como string para evitar erro de serialização
  email: string
}

export default function ListaMembros() {
  const [membros, setMembros] = useState<Membro[]>([])

  async function fetchMembros() {
    const res = await fetch("/api/users")
    const json = await res.json()
    const filtrados = json.filter((m: Membro) => m.id !== "OUTROS")
    setMembros(filtrados)
  }

  useEffect(() => {
    fetchMembros()
    const listener = () => fetchMembros()
    window.addEventListener("UserUpdate", listener)
    return () => window.removeEventListener("UserUpdate", listener)
  }, [])

  function formatarUncao(uncao: string, genero?: string | null): string {
    const feminino = typeof genero === "string" && genero.toLowerCase() === "feminino"

    const mapaUncao: Record<string, string> = {
      "Apóstolo": "Apóstola",
      "Auxiliar": "Auxiliar",
      "Bispo": "Bispa",
      "Cooperador": "Cooperadora",
      "Diácono": "Diaconisa",
      "Dirigente": "Dirigente",
      "Evangelista": "Evangelista",
      "Líder de Louvor": "Líder de Louvor",
      "Membro": "Membra",
      "Ministro de Música": "Ministra de Música",
      "Missionário": "Missionária",
      "Obreiro": "Obreira",
      "Pastor": "Pastora",
      "Presbítero": "Presbítera",
      "Profeta": "Profetisa",
      "Visitante": "Visitante",
      "Mestre": "Mestra"
    }

    return feminino && mapaUncao[uncao] ? mapaUncao[uncao] : uncao
  }

  function formatarData(data: string): string {
    const d = new Date(data)
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="w-full gap-4">
      <CardUniversal
        icon={<User2 className="h-6 w-6 text-gray-500" />}
        title="Usuários"
        description=""
      >
        <div className="grid grid-cols-1 gap-4">
          {membros.map((m) => (
            <article
              key={m.id}
              className="border rounded-lg p-4 shadow-sm space-y-2 transition hover:shadow-md bg-white"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  {m.image && m.image.startsWith("http") ? (
                    <AvatarImage
                      src={m.image}
                      alt={`Avatar de ${formatarUncao(m.uncao, m.genero)} ${m.name}`}
                    />
                  ) : (
                    <AvatarFallback>
                      <User2 className="h-6 w-6 text-gray-600" />
                    </AvatarFallback>
                  )}
                </Avatar>

                {/* Nome + Unção */}
                <div>
                  <p className="text-sm font-semibold flex items-center gap-1">
                    {m.uncaoVerified === "true" && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        Verificado
                      </span>
                    )}
                    {formatarUncao(m.uncao, m.genero)} {m.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Desde {formatarData(m.createdAt)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </CardUniversal>
    </div>
  )
}
