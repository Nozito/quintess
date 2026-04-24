"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ClipboardList,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
  { label: "Demandes", href: "/admin/demandes", icon: ClipboardList },
  { label: "Partenaires", href: "/admin/partenaires", icon: Briefcase },
  { label: "Ajouter partenaire", href: "/admin/partenaires/nouveau", icon: PlusCircle },
  { label: "Clients", href: "/admin/clients", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin" className="font-serif text-lg font-semibold tracking-widest">
          QUINTESS
        </Link>
        <span className="ml-2 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
          Admin
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
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
          Interface d'administration
        </p>
      </div>
    </aside>
  );
}
