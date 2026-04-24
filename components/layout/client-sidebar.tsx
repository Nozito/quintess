"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Nouvelle demande", href: "/demande/nouvelle", icon: PlusCircle },
  { label: "Mes demandes", href: "/dashboard", icon: ClipboardList },
  { label: "Mon profil", href: "/profil", icon: User },
];

export function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="font-serif text-lg font-semibold tracking-widest">
          QUINTESS
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          Discrétion · Excellence
        </p>
      </div>
    </aside>
  );
}
