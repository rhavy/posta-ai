"use client";
import { useState } from "react";
import {
  Edit2Icon,
  CalendarIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  ScrollIcon,
  TypeIcon,
} from "lucide-react";


type CampoEditavelProps = {
  userId      : string;
  valorInicial: string;
  label       : string;
  campo       : string;
  tabela      : string;
  cad?        : true | false;
  tamanho?    : "w-full" | "max-w-2xl" | "max-w-md" | "max-w-sm" | "max-w-xs" | "max-w-lg";
  tipo?       : "textarea" | "text" | "number" | "email" | "password" | "select" | "date";
};
export function obterIconeTipo(tipo: string) {
  switch (tipo) {
    case "dataNascimento": return <CalendarIcon className="w-4 h-4 text-blue-400" />;
    case "date": return <CalendarIcon className="w-4 h-4 text-blue-400" />;
    case "password": return <LockIcon className="w-4 h-4 text-pink-400" />;
    case "email": return <MailIcon className="w-4 h-4 text-red-400" />;
    case "telefone":
    case "celular": return <PhoneIcon className="w-4 h-4 text-green-400" />;
    case "cpf":
    case "cnpj": return <UserIcon className="w-4 h-4 text-yellow-500" />;
    case "rg": return <ScrollIcon className="w-4 h-4 text-purple-500" />;
    case "genero": return <UserIcon className="w-4 h-4 text-gray-500" />;
    case "textarea": return <TypeIcon className="w-4 h-4 text-gray-500" />;
    default: return null;
  }
}

export function formatarCampo(valor: string, tipo: string): string {
  if (!valor) return "";

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
      return somenteNumeros.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    case "dataNascimento":
    case "date":
      const match = somenteNumeros.match(/^(\d{4})(\d{2})(\d{2})$/);
      return match ? `${match[3]}/${match[2]}/${match[1]}` : valor;

    default:
      return valor;
  }
}

export function validarCampo(valor: string, campo: string): boolean {
  const regras: Record<string, RegExp> = {
    cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    rg: /^\d{2}\.\d{3}\.\d{3}$/,
    telefone: /^\(\d{2}\) \d{4}-\d{4}$/,
    celular: /^\(\d{2}\) \d{5}-\d{4}$/,
    dataNascimento: /^\d{4}-\d{2}-\d{2}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };
  const regex = regras[campo];
  return regex ? regex.test(valor) : true;
}


export default function CampoEditavelCard({
  userId,
  valorInicial,
  label,
  campo,
  tabela,
  cad = true,
  tamanho = "max-w-2xl",
  tipo = "textarea",
}: CampoEditavelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [valor, setValor] = useState(valorInicial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const salvarValor = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/updateBio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, valor, campo, tabela }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsEditing(false);
        setMessage(data.message || `${label} atualizado com sucesso.`);
      } else {
        setMessage(`Erro: ${data.error || "Erro desconhecido."}`);
        console.error("API retornou erro:", data.error);
      }
    } catch (err) {
      setMessage("Erro de rede ao salvar.");
      console.error("Falha na requisição:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${cad ? "border shadow-sm" : ""} mt-6 mx-auto ${tamanho} p-6 rounded-lg bg-white transition-all duration-300`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{obterIconeTipo(campo)} {label}</h2>
        <button
          onClick={isEditing ? salvarValor : () => setIsEditing(true)}
          disabled={loading}
          className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Salvando..." : isEditing ? "Salvar" : <Edit2Icon className="ml-auto w-4 h-4 text-yellow-300" />}
        </button>
      </div>

      <div className="mt-4">
        {isEditing ? (
          tipo === "textarea" ? (
            <textarea
              className="w-full border border-gray-300 p-3 rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-200"
              rows={4}
              placeholder={valor}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          ) : tipo === "select" ? (
            <select
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          ) : tipo === "date" ? (
            <input
              type="date"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          ) : (
            // <input
            //   type={tipo}
            //   className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            //   placeholder={valor}
            //   value={valor}
            //   onChange={(e) => setValor(e.target.value)}
            // />
            <input
              type={tipo}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder={valor}
              value={valor}
              maxLength={ campo === "dataNascimento" ? 8 :campo === "cpf" ? 11 : campo === "cnpj" ? 18 : campo === "rg" ? 9 : campo === "telefone" ? 10 : campo === "celular" ? 11 : undefined}
              onChange={(e) => {
                const textoDigitado = e.target.value;
                const textoFormatado = formatarCampo(textoDigitado, campo);
                setValor(textoFormatado);
              }}
            />

          )
        ) : (
          <p className="text-gray-700 whitespace-pre-line border shadow-sm rounded-lg border-gray-300 p-3">
            {formatarCampo(valor, campo)}
          </p>
        )}
      </div>

      {message && (
        <p className={`mt-4 text-sm font-medium ${message.startsWith("Erro") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
