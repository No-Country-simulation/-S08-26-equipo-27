"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Panel general", icon: "M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" },
  { href: "/incidentes", label: "Incidentes", icon: "M12 2 1 21h22L12 2Zm1 15h-2v-2h2v2Zm0-4h-2V9h2v4Z" },
  { href: "/alertas", label: "Alertas", icon: "M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11c0-3.1-1.6-5.6-4.5-6.3V4a1.5 1.5 0 0 0-3 0v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2Z" },
  { href: "/eventos", label: "Eventos", icon: "M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z" },
  { href: "/activos", label: "Activos", icon: "M4 4h16v6H4V4Zm0 10h16v6H4v-6Zm2-8v2h2V6H6Zm0 10v2h2v-2H6Z" },
  { href: "/vulnerabilidades", label: "Vulnerabilidades", icon: "M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v5Z" },
  { href: "/usuarios", label: "Usuarios", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col border-b border-slate-800 bg-slate-950 md:sticky md:top-0 md:h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2.5 px-5 py-4 md:py-5">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-400" fill="currentColor" aria-hidden>
          <path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4Zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.6 1.4 1.4-6 6Z" />
        </svg>
        <span className="text-lg font-semibold tracking-tight text-white">CyberShield</span>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:pb-0">
        {links.map((link) => {
          const current = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                current
                  ? "bg-emerald-500/10 font-medium text-emerald-300"
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
                <path d={link.icon} />
              </svg>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-slate-800 px-5 py-4 text-xs text-slate-500 md:block">
        <p className="font-medium text-slate-300">Laura Benítez</p>
        <p>Responsable de seguridad</p>
        <p className="mt-2 text-slate-600">Datos de ejemplo</p>
      </div>
    </aside>
  );
}
