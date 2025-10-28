"use client";

import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function VoltarButton({page}:{page: string}) {
  const router = useRouter();
  return (
    <Button
      onClick={() => redirect(page)}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      Voltar
    </Button>
  );
}
