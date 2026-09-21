"use client";

import { useMemo, useState } from "react";
import { EmptyState, RiskMeter, SeverityBadge, StatusBadge, Td, Th } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { Severity, VulnerabilityStatus } from "@/lib/types";

export interface VulnRow {
  id: string;
  cve: string;
  title: string;
  cvss: number;
  severity: Severity;
  status: VulnerabilityStatus;
  asset: string;
  assetCriticality: number;
  assignee: string;
  detectedAt: string;
  dueDate: string;
  resolvedAt?: string;
  overdue: boolean;
  reappeared: boolean;
  businessRisk: number;
}

type Filter = "abiertas" | "vencidas" | "reaparecidas" | "resueltas" | "todas";

const selectClass =
  "rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none";

export function VulnerabilitiesTable({ rows }: { rows: VulnRow[] }) {
  const [filter, setFilter] = useState<Filter>("abiertas");

  const visible = useMemo(
    () =>
      rows
        .filter((r) => {
          switch (filter) {
            case "abiertas":
              return r.status !== "resuelta";
            case "vencidas":
              return r.overdue;
            case "reaparecidas":
              return r.reappeared;
            case "resueltas":
              return r.status === "resuelta";
            default:
              return true;
          }
        })
        .sort((a, b) => b.businessRisk - a.businessRisk),
    [rows, filter],
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-400">
          Mostrar
          <select className={selectClass} value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
            <option value="abiertas">Abiertas y en progreso</option>
            <option value="vencidas">Vencidas</option>
            <option value="reaparecidas">Reaparecidas</option>
            <option value="resueltas">Resueltas</option>
            <option value="todas">Todas</option>
          </select>
        </label>
        <p className="ml-auto text-sm text-slate-500">{visible.length} vulnerabilidad(es), ordenadas por riesgo para el negocio</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full min-w-[960px]">
          <thead className="border-b border-slate-800">
            <tr>
              <Th>Riesgo negocio</Th>
              <Th>Vulnerabilidad</Th>
              <Th>Activo</Th>
              <Th>CVSS</Th>
              <Th>Estado</Th>
              <Th>Responsable</Th>
              <Th>Detectada</Th>
              <Th>Vencimiento</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {visible.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40">
                <Td>
                  <RiskMeter score={r.businessRisk} />
                </Td>
                <Td className="max-w-sm">
                  <p className="font-medium text-slate-100">{r.title}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono">{r.cve}</span>
                    {r.reappeared && (
                      <span className="rounded bg-orange-500/15 px-1.5 py-0.5 text-orange-300">reaparecida</span>
                    )}
                  </p>
                </Td>
                <Td>
                  <p className="font-mono text-xs">{r.asset}</p>
                  <p className="text-xs text-slate-500">Criticidad {r.assetCriticality}/5</p>
                </Td>
                <Td>
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-mono text-sm tabular-nums">{r.cvss.toFixed(1)}</span>
                    <SeverityBadge severity={r.severity} />
                  </div>
                </Td>
                <Td>
                  <StatusBadge status={r.status} />
                </Td>
                <Td>{r.assignee}</Td>
                <Td className="whitespace-nowrap text-slate-500">{formatDate(r.detectedAt)}</Td>
                <Td className="whitespace-nowrap">
                  {r.status === "resuelta" && r.resolvedAt ? (
                    <span className="text-emerald-400">Resuelta {formatDate(r.resolvedAt)}</span>
                  ) : (
                    <span className={r.overdue ? "font-medium text-red-400" : "text-slate-400"}>
                      {formatDate(r.dueDate)}
                      {r.overdue && " · vencida"}
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <EmptyState>No hay vulnerabilidades con este filtro.</EmptyState>}
      </div>
    </>
  );
}
