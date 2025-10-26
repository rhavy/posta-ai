import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import Link from "next/link";
import {
  LayoutDashboard,
  User2,
  PanelBottom,
  Users2,
  Wallet,
  Truck,
  Calendar,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ButtonSignOut } from "@/components/ui/button-signout";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ConfirmSignOut from "./ConfirmSignOut";

export async function Sidebar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const img = session?.user?.image || "";

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profile", icon: User2 },
    { href: "/members", label: "Membros", icon: Users2 },
    { href: "/finances", label: "Finanças", icon: Wallet },
    { href: "/fornecedores", label: "Fornecedores", icon: Truck },
    { href: "/eventos", label: "Eventos", icon: Calendar },
  ];

  return (
    <div className="flex w-full flex-col bg-muted/40">
      {/* SIDEBAR DESKTOP */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            {session && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full">
                <Avatar>
                  <AvatarImage src={img} />
                  <AvatarFallback>
                    {session.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {navLinks.map(({ href, label, icon: Icon }) => (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>

        {/* Logout */}
        {session && (
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* Usar variant "icon" para o botão de logout pequeno */}
                  <ConfirmSignOut variant="icon" />
                </TooltipTrigger>
                <TooltipContent side="right">Sair</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        )}

      </aside>

      {/* MENU MOBILE */}
      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 h-14 flex items-center px-4 border-b bg-background gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelBottom className="w-5 h-5" />
                <span className="sr-only">Abrir / Fechar Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="sm:max-w-xs px-4 py-6">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>

              {session && (
                <nav className="grid gap-4 text-lg font-medium items-center justify-center border-b pb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-primary shadow-md">
                      <AvatarImage src={img} />
                      <AvatarFallback>
                        {session.user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-foreground">
                        Olá, {session.user.name}!
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Bem-vindo(a) de volta
                      </span>
                    </div>
                  </div>
                </nav>
              )}

              <nav className="grid gap-6 text-base font-medium border-b py-6">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <SheetClose key={href} asChild>
                    <Link
                      href={href}
                      className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              {/* Logout */}
              {session && (
                <nav className="mt-auto grid gap-6 text-base font-medium pt-6">
                  <SheetFooter>
                    {/* Não é obrigatório usar SheetClose asChild aqui — o signOut redireciona */}
                    <ConfirmSignOut variant="full" loadingText="Deslogando..." />
                  </SheetFooter>
                </nav>
              )}

            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
}
