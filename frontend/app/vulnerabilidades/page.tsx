import type { Metadata } from "next";
import { VulnerabilitiesTable, type VulnRow } from "@/components/vulnerabilities-table";
import { PageHeader } from "@/components/ui";
import { assetById, vulnerabilities } from "@/lib/mock-data";
import { isVulnOverdue, vulnerabilityRisk } from "@/lib/risk";

export const metadata: Metadata = { title: "Vulnerabilidades" };

export default function VulnerabilitiesPage() {
  const rows: VulnRow[] = vulnerabilities.map((v) => {
    const asset = assetById(v.assetId);
    return {
      id: v.id,
      cve: v.cve,
      title: v.title,
      cvss: v.cvss,
      severity: v.severity,
      status: v.status,
      asset: asset?.name ?? v.assetId,
      assetCriticality: asset?.criticality ?? 0,
      assignee: v.assignee,
      detectedAt: v.detectedAt,
      dueDate: v.dueDate,
      resolvedAt: v.resolvedAt,
      overdue: isVulnOverdue(v),
      reappeared: v.reappeared,
      businessRisk: vulnerabilityRisk(v),
    };
  });

  return (
    <>
      <PageHeader
        title="Vulnerabilidades"
        description="Seguimiento de qué existe, dónde está, quién debe resolverla y cuándo vence. El riesgo para el negocio pondera el CVSS por la criticidad del activo."
      />
      <VulnerabilitiesTable rows={rows} />
    </>
  );
}
