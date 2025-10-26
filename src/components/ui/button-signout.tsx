"use client"

import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";


export function ButtonSignOut() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut({
      fetchOptions:{
        onSuccess: () => {
          router.replace("/login");
          router.refresh(); 
          // router.push("/"); 
        },
        onError: () => {
          alert("Erro ao deslogar!");
        }
      }
    })
  }

  return (
    <Button size="default" variant="outline" onClick={signOut}>
        <LogOut className="h-5 w-5 text-red-500" />
        <span  className="sm:hidden">Sair</span>        
    </Button>
  );
}