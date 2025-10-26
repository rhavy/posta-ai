"use client";

import { useEffect, useState, useRef, JSX, ChangeEvent } from "react";
import {
  CalendarIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  ScrollIcon,
  TypeIcon,
} from "lucide-react";
import { debounce } from "lodash";

type CampoEditavelProps = {
  userId: string;
  valorInicial: string;
  label: string;
  nome?: "Top" | "button";
  campo: string;
  tabela: string;
  cad?: boolean;
  tamanho?: string;
  tipo?: "textarea" | "text" | "number" | "email" | "password" | "select" | "date";
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

// ---------------------------- Funções auxiliares ----------------------------

function obterIconeTipo(tipo: string) {
  const icons: Record<string, JSX.Element> = {
    dataNascimento: <CalendarIcon className="w-4 h-4 text-blue-400" />,
    date: <CalendarIcon className="w-4 h-4 text-blue-400" />,
    password: <LockIcon className="w-4 h-4 text-pink-400" />,
    email: <MailIcon className="w-4 h-4 text-red-400" />,
    telefone: <PhoneIcon className="w-4 h-4 text-green-400" />,
    celular: <PhoneIcon className="w-4 h-4 text-green-400" />,
    cpf: <UserIcon className="w-4 h-4 text-yellow-500" />,
    cnpj: <UserIcon className="w-4 h-4 text-yellow-500" />,
    rg: <ScrollIcon className="w-4 h-4 text-purple-500" />,
    genero: <UserIcon className="w-4 h-4 text-gray-500" />,
    textarea: <TypeIcon className="w-4 h-4 text-gray-500" />,
  };
  return icons[tipo] || null;
}

function formatarCampo(valor: string, tipo: string): string {
  const somenteNumeros = valor.replace(/\D/g, "");
  switch (tipo) {
    case "cpf":
      return somenteNumeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    case "cnpj":
      return somenteNumeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    case "rg":
      return somenteNumeros.replace(/^(\d{2})(\d{3})(\d{3})$/, "$1.$2.$3");
    case "telefone":
      return somenteNumeros.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    case "celular":
      return somenteNumeros.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4");
    case "cep":
      return somenteNumeros.replace(/^(\d{5})(\d{3})$/, "$1-$2");
    case "dataNascimento":
    case "date":
      const match = somenteNumeros.match(/^(\d{4})(\d{2})(\d{2})$/);
      return match ? `${match[3]}/${match[2]}/${match[1]}` : valor;
    default:
      return valor;
  }
}

function formatarParaInputDate(data: string): string {
  const d = new Date(data);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}

// ---------------------------- Componente principal ----------------------------

export function InputAutoSalve({
  userId,
  valorInicial,
  label,
  nome,
  campo,
  tabela,
  cad = true,
  tamanho = "max-w-2xl",
  tipo = "text",
  onChange,
}: CampoEditavelProps) {
  const [valor, setValor] = useState(
    tipo === "date" ? formatarParaInputDate(valorInicial) : valorInicial
  );

  // 🔹 Sincroniza valor interno quando valorInicial mudar externamente
  useEffect(() => {
    setValor(tipo === "date" ? formatarParaInputDate(valorInicial) : valorInicial);
  }, [valorInicial, tipo]);

  const [message, setMessage] = useState<string | null>(null);

  const salvarDebounced = useRef(
    debounce(async (novoValor: string) => {
      try {
        const res = await fetch("/api/updateBio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, valor: novoValor, campo, tabela }),
        });
        const data = await res.json();
        setMessage(res.ok ? `${label} atualizado.` : `Erro: ${data.error || "Erro desconhecido"}`);
      } catch (err) {
        console.error("Erro ao salvar:", err);
        setMessage("Erro de rede ao salvar.");
      }
    }, 800)
  ).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const textoDigitado = e.target.value;
    const textoFormatado = tipo === "date" ? textoDigitado : formatarCampo(textoDigitado, campo);
    setValor(textoFormatado);
    salvarDebounced(textoFormatado);
    onChange?.(e); // notifica o pai
  };

  const maxLengthMap: Record<string, number> = {
    dataNascimento: 8,
    cpf: 11,
    cep: 9,
    cnpj: 18,
    rg: 9,
    telefone: 10,
    celular: 11,
  };
  const maxLength = maxLengthMap[campo];

  let inputField;
  if (tipo === "textarea") {
    inputField = (
      <textarea
        className="w-full border p-3 rounded-md resize-none"
        rows={4}
        placeholder={valorInicial === "" || valorInicial === null ? "Sem biografia definida." : valorInicial}
        value={valor}
        onChange={handleChange}
      />
    );
  } else if (tipo === "select" && campo === "uncao") {
    inputField = (
      <select className="w-full border p-3 rounded-md" value={valor} onChange={handleChange}>
        <option value="">Selecione...</option>
        <option value="Apóstolo">Apóstolo</option>
        <option value="Bispo">Bispo</option>
        <option value="Diácono">Diácono</option>
        <option value="Evangelista">Evangelista</option>
        <option value="Membro">Membro</option>
        <option value="Missionário">Missionário</option>
        <option value="Obreiro">Obreiro</option>
        <option value="Pastor">Pastor</option>
        <option value="Presbítero">Presbítero</option>
        <option value="Visitante">Visitante</option>
      </select>
    );
  } else if (tipo === "select") {
    inputField = (
      <select className="w-full border p-3 rounded-md" value={valor} onChange={handleChange}>
        <option value="">Selecione...</option>
        <option value="Masculino">Masculino</option>
        <option value="Feminino">Feminino</option>
        <option value="Outro">Outro</option>
      </select>
    );
  } else {
    inputField = (
      <input
        type={tipo}
        className="w-full border p-3 rounded-md"
        placeholder={valorInicial === "" || valorInicial === null ? "Vazio." : valorInicial}
        value={valor}
        onChange={handleChange}
        maxLength={maxLength}
        onClick={() => setValor("")}
      />
    );
  }

  return nome === "Top" ? (
    <div className={`w-full ${cad ? "border shadow-sm" : ""} mt-6 mx-auto ${tamanho} p-6 rounded-lg bg-white`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          {obterIconeTipo(campo)} {label}
        </h2>
      </div>
      <div className="mt-4">{inputField}</div>
      {message && (
        <p className={`mt-4 text-sm font-medium ${message.startsWith("Erro") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  ) : (
    <div className={`w-full ${cad ? "border shadow-sm" : ""} mt-6 mx-auto ${tamanho} p-6 rounded-lg bg-white`}>
      <div className="flex items-center gap-4">
        <label className="flex items-center text-gray-800 font-medium">
          {obterIconeTipo(campo)} <span className="ml-1">{label}</span>
        </label>
        <div className="flex-grow">{inputField}</div>
      </div>

      {message && (
        <p className={`mt-4 text-sm font-medium ${message.startsWith("Erro") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
