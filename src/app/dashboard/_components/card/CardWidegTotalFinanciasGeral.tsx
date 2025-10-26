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

export default function CardWidegTotalFinanciasGeral() {
  const [total, setTotal] = useState("0.00")

  async function buscarDados() {
  try {
    const resposta = await fetch(`/api/finances`);
    if (!resposta.ok) {
      throw new Error(`Erro na API: ${resposta.status}`);
    }

    const dados: Finance[] = await resposta.json();

    // soma entradas e subtrai saídas, apenas se sentido for válido
    const soma = dados.reduce((acc, item) => {
      const sentidoValido = ["ENTRADA", "SAIDA"].includes(item.sentido);
      if (!sentidoValido) return acc;

      const valorNum =
        typeof item.valor === "string"
          ? parseFloat(item.valor) || 0
          : item.valor || 0;

      return item.sentido === "ENTRADA"
        ? acc + valorNum
        : acc - valorNum;
    }, 0);

    setTotal(soma.toFixed(2));
  } catch (error) {
    console.error("❌ Erro ao buscar dados:", error);
  }
}


  useEffect(() => {
    buscarDados()
  }, [])

  return (
    <CardCustomPage
      title="Contribuições"
      description="Já Contribuído"
      content={`R$: ${total}`}
      icon={<DollarSign className="w-4 h-4 text-gray-800" />}
    />
  )
}
