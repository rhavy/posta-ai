import { atualizarCampoExistente } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, valor, campo, tabela } = await req.json();

    // 🔒 Validação de tipos
    const parametros = { userId, valor, campo, tabela };
    const faltantes = Object.entries(parametros)
      .filter(([key, val]) => {
        if (key === "userId" || key === "campo" || key === "tabela") {
          return typeof val !== "string";
        }
        if (key === "valor") {
          return typeof val !== "string" && typeof val !== "boolean";
        }
        return false;
      })
      .map(([key]) => key);

    if (faltantes.length > 0) {
      return NextResponse.json(
        {
          error: `Parâmetros inválidos: ${faltantes.join(", ")} devem ser strings ou booleanos.`,
        },
        { status: 400 }
      );
    }

    // 📌 Validação de tabela permitida
    const tabelasPermitidas = ["User", "Perfil", "Pessoal"];
    if (!tabelasPermitidas.includes(tabela)) {
      return NextResponse.json({ error: "Tabela inválida." }, { status: 400 });
    }

    // 🚫 Validação de campo e valor não vazios
    // if (!campo.trim() || valor === "") {      
    //   return NextResponse.json({ error: "Campo ou valor não pode estar vazio." }, { status: 400 });
    // }

    await atualizarCampoExistente(
      tabela as "User" | "Perfil" | "Pessoal",
      campo,
      valor === "" ? "Vazio": valor,
      userId);

    return NextResponse.json({ message: `${campo} atualizado com sucesso!` });

  } catch (error: unknown) {
    // 🧠 Log de erro para monitoramento
    console.error("Erro ao atualizar valor:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao processar a requisição.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
