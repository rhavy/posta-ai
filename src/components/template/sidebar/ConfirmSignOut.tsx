"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Variant = "icon" | "full";

interface ConfirmSignOutProps {
  variant?: Variant;
  loadingText?: string;
  className?: string;
}

/**
 * Componente que exibe um botão (ícone ou full) que abre uma confirmação modal.
 * Ao confirmar, executa signOut() e exibe um loader.
 */
export function ConfirmSignOut({ variant = "icon", loadingText = "Deslogando...", className = "" }: ConfirmSignOutProps) {
  const [loading, setLoading] = useState(false);
     const router = useRouter();

  async function handleConfirm() {
      setLoading(true);
      try {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.replace("/login");
              router.refresh();
            },
            onError: () => {
              alert("Erro ao deslogar!");
            },
          },
        });
      } catch (err) {
        console.error(err);
        alert("Erro ao deslogar!");
      } finally {
        setLoading(false);
      }
    }

  // Trigger diferente dependendo do variant
  const Trigger = (
    <Button
      variant={variant === "icon" ? "ghost" : undefined}
      size={variant === "icon" ? "icon" : undefined}
      className={`flex items-center gap-2 ${className}`}
      aria-label={variant === "icon" ? "Sair" : "Sair da conta"}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      {variant === "full" && <span>{loading ? loadingText : "Sair"}</span>}
    </Button>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {Trigger}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja realmente sair?</AlertDialogTitle>
          <AlertDialogDescription>
            Você será desconectado da sua conta e retornará à página inicial.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" className="mr-2">Cancelar</Button>
          </AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2"
            aria-live="polite"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            <span>{loading ? loadingText : "Confirmar e sair"}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmSignOut;
