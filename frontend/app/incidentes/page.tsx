import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SeverityBadge, StatusBadge, Td, Th } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import { assetById, incidents } from "@/lib/mock-data";
import { SEVERITY_ORDER, isIncidentActive } from "@/lib/risk";

export const metadata: Metadata = { title: "Incidentes" };

export default function IncidentsPage() {
  const sorted = [...incidents].sort(
    (a, b) =>
      Number(isIncidentActive(b)) - Number(isIncidentActive(a)) ||
      SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) ||
      b.openedAt.localeCompare(a.openedAt),
  );

  return (
    <>
      <PageHeader
        title="Incidentes"
        description="Los incidentes sin resolver aparecen primero, ordenados por severidad."
      />
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-slate-800">
            <tr>
              <Th>Incidente</Th>
              <Th>Severidad</Th>
              <Th>Estado</Th>
              <Th>Responsable</Th>
              <Th>Activos afectados</Th>
              <Th>Abierto</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sorted.map((i) => (
              <tr key={i.id} className="hover:bg-slate-800/40">
                <Td className="max-w-md">
                  <Link href={`/incidentes/${i.id}`} className="font-medium text-slate-100 hover:text-emerald-300">
                    {i.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">{i.id}</p>
                </Td>
                <Td>
                  <SeverityBadge severity={i.severity} />
                </Td>
                <Td>
                  <StatusBadge status={i.status} />
                </Td>
                <Td>{i.assignee}</Td>
                <Td className="font-mono text-xs">
                  {i.assetIds.map((id) => assetById(id)?.name).join(", ") || "—"}
                </Td>
                <Td className="whitespace-nowrap text-slate-500">{formatDateTime(i.openedAt)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
