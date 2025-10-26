"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { InputAutoSalve } from "./InputAutoSalve";

interface EnderecoSectionProps {
  userId: string;
  perfil?: {
    rua?: string | null;
    numero?: string | null;
    referencia?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
    pais?: string | null;
    cep?: string | null;
  } | null;
}

export function EnderecoSection({ userId, perfil }: EnderecoSectionProps) {
  const [enderecoAuto, setEnderecoAuto] = useState({
    rua: perfil?.rua || "",
    bairro: perfil?.bairro || "",
    cidade: perfil?.cidade || "",
    estado: perfil?.estado || "",
    pais: perfil?.pais || "",
  });

  const [cep, setCep] = useState(perfil?.cep || "");

  // --- Salva o endereço atualizado no backend ---
  const salvarEndereco = async (campo: string, valor: string) => {
    try {
      await fetch("/api/updateBio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, campo, valor, tabela: "Perfil" }),
      });
    } catch (err) {
      console.error("Erro ao salvar endereço:", err);
    }
  };

  // --- Busca automática de endereço pelo CEP ---
  useEffect(() => {
    async function buscarEnderecoPorCep(cep: string) {
      const cepLimpo = cep.replace(/\D/g, "");
      if (cepLimpo.length !== 8) return;

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          const novoEndereco = {
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
            pais: data.uf ? "Brasil" : "",
          };
          setEnderecoAuto(novoEndereco);

          // 🔹 Salva automaticamente cada campo atualizado
          for (const [campo, valor] of Object.entries(novoEndereco)) {
            await salvarEndereco(campo, valor);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }

    buscarEnderecoPorCep(cep);
  }, [cep, userId]);

   const handleCepChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setCep(e.target.value);
    };

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 px-2 lg:px-0">
        Endereço
      </h3>

      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputAutoSalve
            userId={userId}
            valorInicial={enderecoAuto.rua}
            label="Rua"
            campo="rua"
            tabela="Perfil"
            tipo="text"
            cad={false}
          />
          <InputAutoSalve
            userId={userId}
            valorInicial={perfil?.numero || ""}
            label="Número"
            campo="numero"
            tabela="Perfil"
            tipo="text"
            cad={false}
          />
        </div>

        <InputAutoSalve
          userId={userId}
          valorInicial={perfil?.referencia || ""}
          label="Referência"
          campo="referencia"
          tabela="Perfil"
          tipo="text"
          tamanho="w-full"
          cad={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputAutoSalve
            userId={userId}
            valorInicial={enderecoAuto.bairro}
            label="Bairro"
            campo="bairro"
            tabela="Perfil"
            tipo="text"
            cad={false}
          />
          <InputAutoSalve
            userId={userId}
            valorInicial={enderecoAuto.cidade}
            label="Cidade"
            campo="cidade"
            tabela="Perfil"
            tipo="text"
            cad={false}
          />
          <InputAutoSalve
            userId={userId}
            valorInicial={enderecoAuto.estado}
            label="Estado"
            campo="estado"
            tabela="Perfil"
            tipo="text"
            cad={false}
          />
          <InputAutoSalve
            userId={userId}
            valorInicial={enderecoAuto.pais}
            label="País"
            campo="pais"
            tabela="Perfil"
            tipo="text"
            cad={false}
          />
          <InputAutoSalve
            userId={userId}
            valorInicial={cep}
            label="CEP"
            campo="cep"
            tabela="Perfil"
            tipo="text"
            cad={false}
            onChange={handleCepChange}
          />
        </div>
      </div>
    </section>
  );
}
