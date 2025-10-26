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

export default function StatusDoacaoMensal() {
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
    const cleaned = String(valor)
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "")
    const n = parseFloat(cleaned)
    return isNaN(n) ? 0 : n
  }

  function somaEntradasMensal(): number {
    const hoje = new Date()
    return finances.reduce((acc, f) => {
      if (f.sentido !== "ENTRADA" || !f.criadoEm) return acc
      const d = new Date(f.criadoEm)
      if (d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear()) {
        return acc + toNumber(f.valor)
      }
      return acc
    }, 0)
  }

  function somaMetaMensal(): number {
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

  const totalMensal = somaEntradasMensal()
  const metaMensal = somaMetaMensal()

  const percent = metaMensal > 0 ? totalMensal / metaMensal : 0
  const percentLabel = metaMensal > 0 ? `${Math.round(percent * 100)}%` : "—"

  function badgeClasses() {
    if (metaMensal === 0) return "bg-gray-100 text-gray-700"
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
        description="Meta mensal de doações"
      >
        {loading ? (
          <p className="text-sm text-gray-500">Carregando...</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doação Mensal</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(totalMensal)}{" "}
                  <span className="text-sm text-gray-500">/ Contribuído</span>
                  <br />
                  <span className="text-sm text-gray-500">Meta / </span>
                  <span className="font-medium">
                    {metaMensal > 0 ? formatCurrency(metaMensal) : "Meta indefinida"}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm ${badgeClasses()}`}>
                  {metaMensal === 0 ? "Meta indefinida" : `${percentLabel} da meta`}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  (Calculo Mensal: {formatCurrency(metaMensal)})
                </p>
              </div>
            </div>
          </div>
        )}
      </CardUniversal>
    </div>
  )
}
