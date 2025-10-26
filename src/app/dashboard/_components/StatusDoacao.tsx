"use client"

import React, { useEffect, useState } from "react"
import { DollarSign } from "lucide-react"
import CardUniversal from "./card/cardUniversal"

interface Finance {
  id: string
  userId: string
  sentido: "ENTRADA" | "SAIDA" | "MENSAL"
  criadoEm?: string | null
  valor: number | string
}

export default function StatusDoacao() {
  const [finances, setFinances] = useState<Finance[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchFinances() {
    try {
      setLoading(true)
      const res = await fetch("/api/finances")
      if (!res.ok) throw new Error("Erro ao buscar finances")
      const json = await res.json()
      setFinances(json)
    } catch (error) {
      console.error("❌ Erro:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFinances()
    const listener = () => fetchFinances()
    window.addEventListener("FinanceUpdate", listener)
    return () => window.removeEventListener("FinanceUpdate", listener)
  }, [])

  function toNumber(valor: number | string): number {
    if (typeof valor === "number") return valor
    if (!valor) return 0
    // trata formatos como "R$ 1.234,56" ou "1234.56"
    const cleaned = String(valor).replace(/\s/g, "").replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")
    const n = parseFloat(cleaned)
    return isNaN(n) ? 0 : n
  }

  function somaEntradasHoje(): number {
    const hoje = new Date()
    return finances.reduce((acc, f) => {
      if (f.sentido !== "ENTRADA" || !f.criadoEm) return acc
      const d = new Date(f.criadoEm)
      if (
        d.getDate() === hoje.getDate() &&
        d.getMonth() === hoje.getMonth() &&
        d.getFullYear() === hoje.getFullYear()
      ) {
        return acc + toNumber(f.valor)
      }
      return acc
    }, 0)
  }

  function somaMensalAtual(): number {
    const hoje = new Date()
    return finances.reduce((acc, f) => {
      if (f.sentido !== "MENSAL" || !f.criadoEm) return acc
      const d = new Date(f.criadoEm)
      if (d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear()) {
        return acc + toNumber(f.valor)
      }
      return acc
    }, 0)
  }

  // meta diária = somaMensalAtual / 30 (conforme solicitado)
  const totalDiario = somaEntradasHoje()
  const somaMensal = somaMensalAtual()
  const metaDiaria = somaMensal / 30 // se quiser usar dias do mês: new Date(ano, mes+1, 0).getDate()

  const percent = metaDiaria > 0 ? totalDiario / metaDiaria : 0
  const percentLabel = metaDiaria > 0 ? `${Math.round(percent * 100)}%` : "—"

  function badgeClasses() {
    if (metaDiaria === 0) return "bg-gray-100 text-gray-700"
    if (percent >= 1) return "bg-green-100 text-green-700"
    if (percent >= 0.5) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-700"
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="w-full gap-4">
      <CardUniversal
        icon={<DollarSign className="h-6 w-6 text-gray-500" />}
        title="Status das Doações"
        description="Meta diária de doações"
      >
        {loading ? (
          <p className="text-sm text-gray-500">Carregando...</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doação Diária</p>
                <div className="text-lg font-semibold">
                  {formatCurrency(totalDiario)}{" "}
                  <span className="text-sm text-gray-500">/ Contribuido</span>{" "}
                  <p></p>
                  <span className="text-sm text-gray-500">Meta / </span>
                  <span className="font-medium">{metaDiaria > 0 ? formatCurrency(metaDiaria) : "Meta indefinida"}</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm ${badgeClasses()}`}>
                  {metaDiaria === 0 ? "Meta indefinida" : `${percentLabel} da meta`}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  (Calculo Mensal: {formatCurrency(somaMensal)})
                </p>
              </div>
            </div>
          </div>
        )}
      </CardUniversal>
    </div>
  )
}
