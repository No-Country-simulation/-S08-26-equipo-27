import type { Metadata } from "next";
import { PageHeader, SeverityBadge, Td, Th } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import { assetById, events, userById } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Eventos" };

export default function EventsPage() {
  const sorted = [...events].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <>
      <PageHeader
        title="Eventos de seguridad"
        description="Registro centralizado de lo que reportan firewall, antivirus, EDR, IAM, nube y aplicaciones, en un solo lugar y en orden cronológico."
      />
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-slate-800">
            <tr>
              <Th>Fecha</Th>
              <Th>Origen</Th>
              <Th>Evento</Th>
              <Th>Severidad</Th>
              <Th>Usuario</Th>
              <Th>Activo</Th>
              <Th>IP / ubicación</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sorted.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/40">
                <Td className="whitespace-nowrap font-mono text-xs text-slate-400">{formatDateTime(e.timestamp)}</Td>
                <Td>{e.source}</Td>
                <Td className="max-w-md">
                  <p className="font-medium text-slate-100">{e.type}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{e.description}</p>
                </Td>
                <Td>
                  <SeverityBadge severity={e.severity} />
                </Td>
                <Td>{e.userId ? userById(e.userId)?.name : "—"}</Td>
                <Td className="font-mono text-xs">{e.assetId ? assetById(e.assetId)?.name : "—"}</Td>
                <Td className="text-xs">
                  <span className="font-mono">{e.ip ?? "—"}</span>
                  {e.location && <p className="text-slate-500">{e.location}</p>}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
