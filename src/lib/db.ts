// src/lib/updatePerfilBio.ts
import { prisma } from "@/lib/prisma";

type Tabelas = "User" | "Perfil" | "Pessoal" ;

type ValorPermitido = string | number | boolean;

const camposPermitidosPorTabela: Record<Tabelas, readonly string[]> = {
  User: ["name", "email", "emailVerified", "image", "bio", "banner", "uncao", "uncaoVerified", "dataNascimento", "genero", "cpf", "rg"],
  Perfil: ["rua", "numero", "referencia", "bairro", "cidade", "estado", "pais", "cep"],
  Pessoal: ["telefone", "celular"],
};

const modeloPrisma: Record<Tabelas, any> = {
  User: prisma.user,
  Perfil: prisma.perfil,
  Pessoal: prisma.pessoal,
};

// Tipos esperados por campo
const tiposEsperadosPorCampo: Record<Tabelas, Record<string, "string" | "number" | "boolean" | "date">> = {
  User: {
    name: "string",
    email: "string",
    bio: "string",
    cpf: "string",
    rg: "string",
    uncao: "string",
    uncaoVerified: "boolean",
    emailVerified: "date",
    dataNascimento: "date",
    genero: "string",
    image: "string",
    banner: "string",
  },
  Perfil: {
    rua: "string",
    numero: "string",
    referencia: "string",
    bairro: "string",
    cidade: "string",
    estado: "string",
    pais: "string",
    cep: "string",
  },
  Pessoal: {
    telefone: "string",
    celular: "string",
  },
};

// Função para converter valor para o tipo esperado
function converterValor(valor: string, tipo: "string" | "number" | "boolean" | "date"): ValorPermitido | Date {
  switch (tipo) {
    case "number":
      const num = Number(valor);
      if (isNaN(num)) throw new Error(`Valor "${valor}" não é um número válido.`);
      return num;
    case "boolean":
      if (valor === "true") return true;
      if (valor === "false") return false;
      throw new Error(`Valor "${valor}" não é um booleano válido.`);
    case "date":
      const date = new Date(valor);
      if (isNaN(date.getTime())) throw new Error(`Valor "${valor}" não é uma data válida.`);
      return date;
    default:
      return valor;
  }
}

export async function atualizarCampoExistente(
  tabela: Tabelas,
  campo: string,
  valor: string,
  userId: string
) {
  const camposPermitidos = camposPermitidosPorTabela[tabela];
  const tipoEsperado = tiposEsperadosPorCampo[tabela]?.[campo];

  if (!camposPermitidos.includes(campo)) {
    throw new Error(`O campo "${campo}" não é permitido na tabela "${tabela}".`);
  }

  if (!tipoEsperado) {
    throw new Error(`Tipo esperado não definido para o campo "${campo}" na tabela "${tabela}".`);
  }

  const model = modeloPrisma[tabela];
  const where: Record<string, any> =
    tabela === "User" ? { id: userId } : { userId };

  try {
    const valorConvertido = converterValor(valor, tipoEsperado);

    const registroExistente = await model.findUnique({ where });

    if (!registroExistente) {
      // 🆕 Criação de novo registro
      const dadosCriacao: Record<string, any> = {
        ...where,
        [campo]: valorConvertido,
      };

      const novoRegistro = await model.create({ data: dadosCriacao });

      return {
        data: { [campo]: novoRegistro[campo] },
        error: null,
        created: true,
      };
    }

    // ✏ Atualização de campo existente
    const result = await model.update({
      where,
      data: { [campo]: valorConvertido },
    });

    return {
      data: { [campo]: result[campo] },
      error: null,
      created: false,
    };

  } catch (err: unknown) {
    console.error(`[ERRO] Falha ao atualizar/criar campo "${campo}" na tabela "${tabela}" para o usuário "${userId}":`, err);

    return {
      data: null,
      error: "Erro interno ao atualizar ou criar valor no banco de dados.",
    };
  }
}
