import type { ReactNode } from "react";
import type { RiskLevel } from "@/lib/risk";
import { riskLevel } from "@/lib/risk";
import {
  alertStatusLabel,
  incidentStatusLabel,
  severityLabel,
  vulnStatusLabel,
} from "@/lib/format";
import type { AlertStatus, IncidentStatus, Severity, VulnerabilityStatus } from "@/lib/types";

const severityStyles: Record<Severity, string> = {
  critica: "bg-red-500/15 text-red-300 ring-red-500/30",
  alta: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
  media: "bg-amber-400/15 text-amber-200 ring-amber-400/30",
  baja: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
};

const neutral = "bg-slate-500/15 text-slate-300 ring-slate-500/30";
const active = "bg-blue-500/15 text-blue-300 ring-blue-500/30";
const good = "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30";

const chip = "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset";

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`${chip} ${severityStyles[severity]}`}>{severityLabel[severity]}</span>;
}

const statusTone: Record<string, string> = {
  nueva: severityStyles.alta,
  en_investigacion: active,
  resuelta: good,
  falso_positivo: neutral,
  abierto: severityStyles.alta,
  en_contencion: active,
  resuelto: good,
  abierta: severityStyles.alta,
  en_progreso: active,
};

export function StatusBadge({ status }: { status: AlertStatus | IncidentStatus | VulnerabilityStatus }) {
  const label =
    (alertStatusLabel as Record<string, string>)[status] ??
    (incidentStatusLabel as Record<string, string>)[status] ??
    (vulnStatusLabel as Record<string, string>)[status];
  return <span className={`${chip} ${statusTone[status]}`}>{label}</span>;
}

export const riskColors: Record<RiskLevel, { bar: string; text: string; label: string }> = {
  critico: { bar: "bg-red-500", text: "text-red-400", label: "Crítico" },
  alto: { bar: "bg-orange-500", text: "text-orange-400", label: "Alto" },
  medio: { bar: "bg-amber-400", text: "text-amber-300", label: "Medio" },
  bajo: { bar: "bg-emerald-500", text: "text-emerald-400", label: "Bajo" },
};

export function RiskMeter({ score }: { score: number }) {
  const c = riskColors[riskLevel(score)];
  return (
    <div className="flex items-center gap-2" title={`Riesgo ${c.label.toLowerCase()}`}>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-700/70">
        <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`w-7 text-right text-xs font-semibold tabular-nums ${c.text}`}>{score}</span>
    </div>
  );
}

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-slate-800 bg-slate-900/60 ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Th({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top text-sm text-slate-300 ${className}`}>{children}</td>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="px-4 py-10 text-center text-sm text-slate-500">{children}</p>;
}
