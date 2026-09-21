"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState, RiskMeter, SeverityBadge, StatusBadge, Td, Th } from "@/components/ui";
import { severityLabel, timeAgo } from "@/lib/format";
import type { AlertStatus, Severity } from "@/lib/types";

export interface AlertRow {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: AlertStatus;
  createdAt: string;
  priority: number;
  factors: { label: string; points: number }[];
  assets: string[];
  userName?: string;
  incidentId?: string;
}

type StatusFilter = "activas" | "todas" | AlertStatus;

const selectClass =
  "rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none";

export function AlertsTable({ rows }: { rows: AlertRow[] }) {
  const [status, setStatus] = useState<StatusFilter>("activas");
  const [severity, setSeverity] = useState<Severity | "todas">("todas");
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      rows
        .filter((r) => {
          if (status === "activas") return r.status === "nueva" || r.status === "en_investigacion";
          return status === "todas" || r.status === status;
        })
        .filter((r) => severity === "todas" || r.severity === severity)
        .sort((a, b) => b.priority - a.priority),
    [rows, status, severity],
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-400">
          Estado
          <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
            <option value="activas">Requieren atención</option>
            <option value="todas">Todas</option>
            <option value="nueva">Nuevas</option>
            <option value="en_investigacion">En investigación</option>
            <option value="resuelta">Resueltas</option>
            <option value="falso_positivo">Falsos positivos</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-400">
          Severidad
          <select className={selectClass} value={severity} onChange={(e) => setSeverity(e.target.value as Severity | "todas")}>
            <option value="todas">Todas</option>
            {(Object.keys(severityLabel) as Severity[]).map((s) => (
              <option key={s} value={s}>
                {severityLabel[s]}
              </option>
            ))}
          </select>
        </label>
        <p className="ml-auto text-sm text-slate-500">
          {visible.length} alerta(s), ordenadas por prioridad
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full min-w-[820px]">
          <thead className="border-b border-slate-800">
            <tr>
              <Th>Prioridad</Th>
              <Th>Alerta</Th>
              <Th>Severidad</Th>
              <Th>Estado</Th>
              <Th>Activos</Th>
              <Th>Cuándo</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {visible.map((r) => (
              <FragmentRow key={r.id} row={r} open={expanded === r.id} onToggle={() => setExpanded(expanded === r.id ? null : r.id)} />
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <EmptyState>No hay alertas con estos filtros.</EmptyState>}
      </div>
    </>
  );
}

function FragmentRow({ row, open, onToggle }: { row: AlertRow; open: boolean; onToggle: () => void }) {
  return (
    <>
      <tr className="cursor-pointer hover:bg-slate-800/40" onClick={onToggle}>
        <Td>
          <RiskMeter score={row.priority} />
        </Td>
        <Td className="max-w-md">
          <button
            type="button"
            aria-expanded={open}
            className="text-left font-medium text-slate-100"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {row.title}
          </button>
          <p className="mt-0.5 text-xs text-slate-500">
            {row.id}
            {row.userName && ` · ${row.userName}`}
          </p>
        </Td>
        <Td>
          <SeverityBadge severity={row.severity} />
        </Td>
        <Td>
          <StatusBadge status={row.status} />
        </Td>
        <Td className="font-mono text-xs">{row.assets.join(", ") || "—"}</Td>
        <Td className="whitespace-nowrap text-slate-500">{timeAgo(row.createdAt)}</Td>
      </tr>
      {open && (
        <tr className="bg-slate-950/50">
          <td colSpan={6} className="px-4 py-4">
            <p className="text-sm text-slate-300">{row.description}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">Por qué tiene esta prioridad</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {row.factors.map((f) => (
                <li key={f.label} className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
                  {f.label} <span className="font-semibold text-emerald-400">+{f.points}</span>
                </li>
              ))}
            </ul>
            {row.incidentId && (
              <Link href={`/incidentes/${row.incidentId}`} className="mt-3 inline-block text-sm text-emerald-400 hover:underline">
                Ver incidente {row.incidentId} →
              </Link>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
