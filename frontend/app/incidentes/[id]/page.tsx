import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, RiskMeter, SeverityBadge, StatusBadge } from "@/components/ui";
import { formatDateTime, formatTime } from "@/lib/format";
import { alertById, assetById, incidentById, incidents, userById } from "@/lib/mock-data";
import { alertPriority, assetRisk } from "@/lib/risk";
import type { TimelineEntry } from "@/lib/types";

export function generateStaticParams() {
  return incidents.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: PageProps<"/incidentes/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: incidentById(id)?.id ?? "Incidente" };
}

const kindStyle: Record<TimelineEntry["kind"], { dot: string; label: string }> = {
  evento: { dot: "bg-slate-400", label: "Evento" },
  deteccion: { dot: "bg-red-400", label: "Detección" },
  accion: { dot: "bg-emerald-400", label: "Acción" },
};

export default async function IncidentPage({ params }: PageProps<"/incidentes/[id]">) {
  const { id } = await params;
  const incident = incidentById(id);
  if (!incident) notFound();

  const relatedAssets = incident.assetIds.flatMap((aid) => {
    const asset = assetById(aid);
    return asset ? [{ asset, risk: assetRisk(asset).score }] : [];
  });
  const relatedUsers = incident.userIds.flatMap((uid) => userById(uid) ?? []);
  const relatedAlerts = incident.alertIds.flatMap((aid) => alertById(aid) ?? []);

  return (
    <>
      <Link href="/incidentes" className="text-sm text-slate-400 hover:text-slate-200">
        ← Incidentes
      </Link>

      <div className="mb-6 mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-slate-500">{incident.id}</span>
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
        <h1 className="mt-2 max-w-4xl text-2xl font-semibold tracking-tight text-white">{incident.title}</h1>
        <p className="mt-2 text-sm text-slate-400">
          Responsable: <span className="text-slate-200">{incident.assignee}</span> · Abierto el {formatDateTime(incident.openedAt)}
          {incident.resolvedAt && <> · Resuelto el {formatDateTime(incident.resolvedAt)}</>}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-4">
          <Card title="Resumen">
            <p className="px-4 py-4 text-sm leading-relaxed text-slate-300">{incident.summary}</p>
          </Card>

          <Card title="Línea de tiempo">
            <ol className="px-4 py-4">
              {incident.timeline.map((t, idx) => (
                <li key={idx} className="relative flex gap-4 pb-5 last:pb-0">
                  {idx < incident.timeline.length - 1 && (
                    <span className="absolute left-[5px] top-4 h-full w-px bg-slate-800" aria-hidden />
                  )}
                  <span className={`relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${kindStyle[t.kind].dot}`} />
                  <div>
                    <p className="text-xs text-slate-500">
                      <span className="font-mono">{formatTime(t.at)}</span> · {kindStyle[t.kind].label}
                      {t.actor && <> · {t.actor}</>}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-200">{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          {incident.recommendedActions.length > 0 && (
            <Card title={incident.status === "resuelto" ? "Acciones preventivas" : "Acciones recomendadas"}>
              <ul className="divide-y divide-slate-800">
                {incident.recommendedActions.map((a) => (
                  <li key={a} className="flex gap-3 px-4 py-3 text-sm text-slate-300">
                    <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded border border-slate-600" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="grid content-start gap-4">
          <Card title="Activos afectados">
            {relatedAssets.length === 0 ? (
              <p className="px-4 py-4 text-sm text-slate-500">Sin activos asociados.</p>
            ) : (
              <ul className="divide-y divide-slate-800">
                {relatedAssets.map(({ asset, risk }) => (
                  <li key={asset.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <p className="font-mono text-sm text-slate-100">{asset.name}</p>
                      <p className="text-xs text-slate-500">Criticidad {asset.criticality}/5</p>
                    </div>
                    <RiskMeter score={risk} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Usuarios involucrados">
            {relatedUsers.length === 0 ? (
              <p className="px-4 py-4 text-sm text-slate-500">Sin usuarios asociados.</p>
            ) : (
              <ul className="divide-y divide-slate-800">
                {relatedUsers.map((u) => (
                  <li key={u.id} className="px-4 py-3">
                    <p className="text-sm text-slate-100">{u.name}</p>
                    <p className="text-xs text-slate-500">
                      {u.department}
                      {u.privileged && " · cuenta privilegiada"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Alertas relacionadas">
            <ul className="divide-y divide-slate-800">
              {relatedAlerts.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-100">{a.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{a.id}</p>
                  </div>
                  <RiskMeter score={alertPriority(a).score} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
