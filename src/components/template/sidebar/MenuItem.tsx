import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import Link from "next/link";
import { JSX } from "react";

export function MenuItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: JSX.Element;
  label: string;
}) {
  return (
    <nav className="grid gap-6 text-base font-medium border-b py-6">
      <SheetFooter>
        <SheetClose asChild>
          <Link
            href={href}
            className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
            prefetch={false}
          >
            {icon}
            {label}
          </Link>
        </SheetClose>
      </SheetFooter>
    </nav>
  );
}
