"use client";

import { useEffect, useState, useRef, ChangeEvent, JSX } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

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

const ICONE_MAP: Record<string, JSX.Element> = {
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

function formatarCampo(valor: string, tipo: string): string {
  const apenasNum = valor.replace(/\D/g, "");
  switch (tipo) {
    case "cpf": return apenasNum.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    case "cnpj": return apenasNum.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    case "rg": return apenasNum.replace(/^(\d{2})(\d{3})(\d{3})$/, "$1.$2.$3");
    case "telefone": return apenasNum.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4");
    case "celular": return apenasNum.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4");
    case "cep": return apenasNum.replace(/^(\d{5})(\d{3})$/, "$1-$2");
    case "dataNascimento":
    case "date":
      const m = apenasNum.match(/^(\d{4})(\d{2})(\d{2})$/);
      return m ? `${m[3]}/${m[2]}/${m[1]}` : valor;
    default: return valor;
  }
}

function formatarParaInputDate(data: string) {
  const d = new Date(data);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

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
  const [valor, setValor] = useState(tipo === "date" ? formatarParaInputDate(valorInicial) : valorInicial);
  const [message, setMessage] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setValor(tipo === "date" ? formatarParaInputDate(valorInicial) : valorInicial);
  }, [valorInicial, tipo]);

  const salvarDebounced = useRef(
    debounce(async (novoValor: string) => {
      setSalvando(true);
      try {
        const res = await fetch("/api/updateBio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, valor: novoValor, campo, tabela }),
        });
        const data = await res.json();
        setMessage(res.ok ? `${label} atualizado.` : `Erro: ${data.error || "Erro desconhecido"}`);
      } catch (err) {
        console.error(err);
        setMessage("Erro de rede ao salvar.");
      } finally {
        setTimeout(() => setSalvando(false), 300);
      }
    }, 800)
  ).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const texto = e.target.value;
    const formatado = tipo === "date" ? texto : formatarCampo(texto, campo);
    setValor(formatado);
    salvarDebounced(formatado);
    onChange?.(e);
  };

  const maxLengthMap: Record<string, number> = {
    dataNascimento: 8, cpf: 11, cep: 9, cnpj: 18, rg: 9, telefone: 11, celular: 11,
  };
  const maxLength = maxLengthMap[campo];

  // ---------- Campo renderizado ----------
  let inputField;
  const baseClasses = "w-full rounded-md p-2 outline-none transition-all duration-200";

  if (tipo === "textarea") {
    inputField = (
      <textarea
        className={`${baseClasses} resize-none border focus:ring-2 ${message?.startsWith("Erro") ? "border-red-500 focus:ring-red-500" : "border-blue-300 focus:ring-blue-400"}`}
        rows={4}
        placeholder="Sem valor definido"
        value={valor}
        onChange={handleChange}
      />
    );
  } else if (tipo === "select") {
    const options = campo === "uncao"
      ? ["Apóstolo","Bispo","Diácono","Evangelista","Membro","Missionário","Obreiro","Pastor","Presbítero","Visitante"]
      : ["Masculino","Feminino","Outro"];
    inputField = (
      <select
        className={`${baseClasses} border focus:ring-2 ${message?.startsWith("Erro") ? "border-red-500 focus:ring-red-500" : "border-blue-300 focus:ring-blue-400"}`}
        value={valor}
        onChange={handleChange}
      >
        <option value="">Selecione...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  } else {
    inputField = (
      <input
        type={tipo}
        className={`${baseClasses} border focus:ring-2 ${message?.startsWith("Erro") ? "border-red-500 focus:ring-red-500" : "border-blue-300 focus:ring-blue-400"}`}
        placeholder="Digite aqui"
        value={valor}
        onChange={handleChange}
        maxLength={maxLength}
      />
    );
  }

  // ---------- Container ----------
  const containerBase = `w-full mt-4 mx-auto p-4 rounded-lg bg-white transition-shadow duration-300`;
  const containerBorder = cad ? "border shadow-md hover:shadow-lg" : "";

  return (
    <motion.div layout className={`${containerBase} ${containerBorder} ${tamanho}`} whileHover={{ scale: 1.01 }}>
      <div className={`flex ${nome === "Top" ? "flex-col" : "flex-col md:flex-row md:items-center"} gap-2`}>
        <label className={`flex items-center gap-2 text-gray-800 font-medium ${nome !== "Top" ? "hover:text-blue-500 transition-colors duration-200" : ""}`}>
          {ICONE_MAP[campo] || null} <span>{label}</span>
        </label>
        <div className="relative flex-grow">
          {inputField}
          <motion.div
            className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400"
            animate={{ opacity: salvando ? 1 : 0 }}
          >
            {salvando && "Salvando..."}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`mt-2 text-sm font-medium ${message.startsWith("Erro") ? "text-red-600" : "text-green-600"}`}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
