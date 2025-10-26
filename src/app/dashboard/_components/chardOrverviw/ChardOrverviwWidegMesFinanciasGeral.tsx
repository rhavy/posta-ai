"use client"

import { useEffect, useState } from "react"
import { ChartOverview } from "@/components/chardOrverviw/page"

interface ChartDataPoint {
  month: string    // aqui month será, na verdade, o dia do mês (ex: "01", "15"…)
  entrada: number
  saida: number
}

type Finance = {
  id: string
  userId: string
  sentido: "ENTRADA" | "SAIDA"
  criadoEm?: string | null
  valor: number | string
}

export default function ChardOrverviwWidegMesFinanciasGeral() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    async function buscarDados() {
      try {
        const res = await fetch("/api/finances")
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const dados: Finance[] = await res.json()

        const hoje = new Date()
        const mesAtual = hoje.getMonth()
        const anoAtual = hoje.getFullYear()

        // filtra apenas lançamentos do usuário no mês/ano atual
        const lancamentos = dados.filter((f) => {
          if (!f.criadoEm || !["ENTRADA", "SAIDA"].includes(f.sentido)) return false;
          const dt = new Date(f.criadoEm);
          return dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual;
        });


        // agrupa por dia do mês ("DD")
        const mapa = new Map<string, { month: string; entrada: number; saida: number }>()

        lancamentos.forEach((f) => {
          const dt = new Date(f.criadoEm!)
          const dia = String(dt.getDate()).padStart(2, "0")  // "01", "02", ..., "31"

          const valorNum =
            typeof f.valor === "string"
              ? parseFloat(f.valor) || 0
              : f.valor || 0

          if (!mapa.has(dia)) {
            mapa.set(dia, { month: dia, entrada: 0, saida: 0 })
          }

          const item = mapa.get(dia)!
          if (f.sentido === "ENTRADA") item.entrada += valorNum
          else if(f.sentido === "SAIDA") item.saida += valorNum
        })

        // converte o Map em array ordenado pelo dia
        const dadosChart = Array.from(mapa.values()).sort((a, b) => {
          return Number(a.month) - Number(b.month)
        })

        setChartData(dadosChart)
      } catch (err) {
        console.error("Erro carregando dados:", err)
      }
    }

    buscarDados()
  }, [])

  return (
    <ChartOverview
      title="Dashboard Geral Mensal"
      chartData={chartData}
    />
  )
}
