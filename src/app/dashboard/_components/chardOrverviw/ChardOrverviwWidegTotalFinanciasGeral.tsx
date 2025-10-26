"use client"

import { ChartOverview } from "@/components/chardOrverviw/page"
import { useEffect, useState } from "react"

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

export default function ChardOrverviwWidegTotalFinanciasGeral() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    async function buscarDados() {
      try {
        const res = await fetch(`/api/finances`)
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const dados: Finance[] = await res.json()

        // filtra apenas lançamentos do usuário (sem restrição de mês)
        const lancamentos = dados.filter(f => f.sentido === "ENTRADA" || f.sentido === "SAIDA" &&
          f.criadoEm
        )

        // agrupa por dia do mês ("DD")
        const mapa = new Map<string, { month: string; entrada: number; saida: number }>()

        lancamentos.forEach(f => {
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
          if (f.sentido === "ENTRADA") {item.entrada += valorNum}
          else if(f.sentido === "SAIDA") item.saida += valorNum
        })

        // converte o Map em array ordenado pelo dia
        const dadosChart = Array.from(mapa.values()).sort((a, b) =>
          Number(a.month) - Number(b.month)
        )

        setChartData(dadosChart)
      } catch (err) {
        console.error("Erro carregando dados:", err)
      }
    }

    buscarDados()
  }, [])

  return (
    <ChartOverview
      title="Dashboard Geral Total"
      chartData={chartData}
    />
  )
}
