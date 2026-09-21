import type { Metadata } from "next";
import { PageHeader, RiskMeter, Td, Th } from "@/components/ui";
import { assetTypeLabel, environmentLabel } from "@/lib/format";
import { assets } from "@/lib/mock-data";
import { assetRisk } from "@/lib/risk";

export const metadata: Metadata = { title: "Activos" };

export default function AssetsPage() {
  const rows = assets.map((asset) => ({ asset, ...assetRisk(asset) })).sort((a, b) => b.score - a.score);

  return (
    <>
      <PageHeader
        title="Activos"
        description="El riesgo combina qué tan importante es el activo para el negocio con sus vulnerabilidades abiertas y las alertas activas."
      />
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full min-w-[820px]">
          <thead className="border-b border-slate-800">
            <tr>
              <Th>Activo</Th>
              <Th>Tipo</Th>
              <Th>Entorno</Th>
              <Th>Criticidad</Th>
              <Th>Vulnerab. abiertas</Th>
              <Th>Alertas activas</Th>
              <Th>Responsable</Th>
              <Th>Riesgo</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map(({ asset, score, openVulns, activeAlerts }) => (
              <tr key={asset.id} className="hover:bg-slate-800/40">
                <Td>
                  <p className="font-mono font-medium text-slate-100">{asset.name}</p>
                  <p className="text-xs text-slate-500">{asset.ip}</p>
                </Td>
                <Td>{assetTypeLabel[asset.type]}</Td>
                <Td>{environmentLabel[asset.environment]}</Td>
                <Td>
                  <span className="flex gap-0.5" role="img" aria-label={`Criticidad ${asset.criticality} de 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <i key={n} className={`h-2 w-3 rounded-sm ${n <= asset.criticality ? "bg-emerald-400" : "bg-slate-700"}`} />
                    ))}
                  </span>
                </Td>
                <Td className="tabular-nums">{openVulns}</Td>
                <Td className="tabular-nums">{activeAlerts}</Td>
                <Td>{asset.owner}</Td>
                <Td>
                  <RiskMeter score={score} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
