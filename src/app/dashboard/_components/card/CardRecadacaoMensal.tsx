"use client"

import CardCustomPage from "@/components/cardCuston/page"
import { DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

type Finance = {
  id: string
  userId: string
  sentido: "ENTRADA" | "SAIDA" | "MENSAL"
  criadoEm?: string | null
  valor: number | string
}

export default function CardRecadacaoMensal() {
  const [total, setTotal] = useState("0.00")

  async function buscarDados() {
    try {
      const resposta = await fetch(`/api/finances`)
      if (!resposta.ok) {
        throw new Error(`Erro na API: ${resposta.status}`)
      }

      const dados: Finance[] = await resposta.json()

      const hoje = new Date()
      const mesAtual = hoje.getMonth()
      const anoAtual = hoje.getFullYear()

      // filtra apenas os lançamentos MENSAL do mês atual
      const lancamentosMensais = dados.filter((item) => {
        if (item.sentido !== "MENSAL") return false
        if (!item.criadoEm) return false

        const data = new Date(item.criadoEm)
        return (
          data.getMonth() === mesAtual &&
          data.getFullYear() === anoAtual
        )
      })

      // soma o valor total mensal
      const somaMensal = lancamentosMensais.reduce((acc, item) => {
        const valorNum =
          typeof item.valor === "string"
            ? parseFloat(item.valor) || 0
            : item.valor || 0
        return acc + valorNum
      }, 0)

      setTotal(somaMensal.toFixed(2))
    } catch (error) {
      console.error("❌ Erro ao buscar dados:", error)
    }
  }

  useEffect(() => {
    buscarDados()
  }, [])

  return (
    <CardCustomPage
      title="Arrecadação Mensal"
      description="Total de todos os lançamentos MENSAL deste mês"
      content={`R$: ${total}`}
      icon={<DollarSign className="w-4 h-4 text-gray-800" />}
    />
  )
}
