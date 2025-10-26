"use client"

import CardCustomPage from "@/components/cardCuston/page"
import { DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

type Finance = {
  id: string
  userId: string
  sentido: "ENTRADA" | "SAIDA"
  criadoEm?: string | null
  valor: number | string
}

export default function CardWidegTotalFinancias({ id }: { id: string }) {
  const [total, setTotal] = useState("0.00")

  async function buscarDados() {
    try {
      const resposta = await fetch(`/api/finances`)
      if (!resposta.ok) {
        throw new Error(`Erro na API: ${resposta.status}`)
      }

      const dados: Finance[] = await resposta.json()

      // filtra apenas lançamentos deste usuário
      const meusLancamentos = dados.filter(item => item.userId === id)

      // soma ou subtrai conforme sentido
      const soma = meusLancamentos.reduce((acc, item) => {
        const valorNum =
          typeof item.valor === "string"
            ? parseFloat(item.valor) || 0
            : item.valor || 0

        if (item.sentido === "ENTRADA") {
          return acc + valorNum
        } else if (item.sentido === "SAIDA") {
          return acc - valorNum
        }

        return acc
      }, 0)

      // formata como string com duas casas decimais
      setTotal(soma.toFixed(2))
    } catch (error) {
      console.error("❌ Erro ao buscar dados:", error)
    }
  }

  useEffect(() => {
    buscarDados()
  }, [id])

  return (
    <CardCustomPage
      title="Minhas Contribuições"
      description="Já Contribuído"
      content={`R$: ${total}`}
      icon={<DollarSign className="w-4 h-4 text-gray-800" />}
    />
  )
}
