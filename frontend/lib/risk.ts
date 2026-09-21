import {
  NOW,
  alerts,
  assetById,
  assets,
  incidents,
  userById,
  users,
  vulnerabilities,
} from "./mock-data";
import type { Alert, Asset, Incident, Severity, User, Vulnerability } from "./types";

export type RiskLevel = "critico" | "alto" | "medio" | "bajo";

export const SEVERITY_ORDER: Severity[] = ["critica", "alta", "media", "baja"];

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export const riskLevel = (score: number): RiskLevel =>
  score >= 75 ? "critico" : score >= 50 ? "alto" : score >= 25 ? "medio" : "bajo";

/** Una alerta sigue requiriendo atención mientras no esté resuelta ni descartada. */
export const isAlertActive = (a: Alert) => a.status === "nueva" || a.status === "en_investigacion";
export const isIncidentActive = (i: Incident) => i.status !== "resuelto";
export const isVulnOpen = (v: Vulnerability) => v.status !== "resuelta";
export const isVulnOverdue = (v: Vulnerability) => isVulnOpen(v) && v.dueDate < NOW;

/**
 * Prioridad de una alerta (0-100). Combina la severidad con el contexto del
 * negocio: qué tan crítico es el activo afectado y si hay un usuario
 * privilegiado o un dispositivo desconocido involucrado.
 */
export interface PriorityBreakdown {
  score: number;
  factors: { label: string; points: number }[];
}

const SEVERITY_BASE: Record<Severity, number> = { critica: 50, alta: 38, media: 24, baja: 10 };

export function alertPriority(alert: Alert): PriorityBreakdown {
  const factors = [{ label: `Severidad ${alert.severity}`, points: SEVERITY_BASE[alert.severity] }];

  const maxCriticality = Math.max(0, ...alert.assetIds.map((id) => assetById(id)?.criticality ?? 0));
  if (maxCriticality > 0) {
    factors.push({ label: `Activo con criticidad ${maxCriticality}/5`, points: maxCriticality * 4 });
  }

  const user = alert.userId ? userById(alert.userId) : undefined;
  if (user?.privileged) factors.push({ label: "Cuenta privilegiada", points: 10 });
  if (user && !user.knownDevice) factors.push({ label: "Dispositivo desconocido", points: 5 });
  if (alert.incidentId) factors.push({ label: "Vinculada a un incidente", points: 5 });

  return { score: clamp(factors.reduce((sum, f) => sum + f.points, 0)), factors };
}

const VULN_WEIGHT: Record<Severity, number> = { critica: 20, alta: 12, media: 6, baja: 2 };
const ALERT_WEIGHT: Record<Severity, number> = { critica: 15, alta: 10, media: 5, baja: 2 };

/** Riesgo de un activo (0-100): importancia para el negocio + vulnerabilidades abiertas + alertas activas. */
export function assetRisk(asset: Asset) {
  const openVulns = vulnerabilities.filter((v) => v.assetId === asset.id && isVulnOpen(v));
  const activeAlerts = alerts.filter((a) => a.assetIds.includes(asset.id) && isAlertActive(a));

  const base = asset.criticality * 8;
  const vulnPoints = Math.min(40, openVulns.reduce((s, v) => s + VULN_WEIGHT[v.severity], 0));
  const alertPoints = Math.min(20, activeAlerts.reduce((s, a) => s + ALERT_WEIGHT[a.severity], 0));

  return {
    score: clamp(base + vulnPoints + alertPoints),
    openVulns: openVulns.length,
    activeAlerts: activeAlerts.length,
  };
}

const USER_ALERT_WEIGHT: Record<Severity, number> = { critica: 30, alta: 20, media: 10, baja: 3 };

/** Riesgo de comportamiento de un usuario (0-100). */
export function userRisk(user: User) {
  const userAlerts = alerts.filter((a) => a.userId === user.id && isAlertActive(a));
  const reasons: string[] = [];
  let score = 0;

  for (const a of userAlerts) {
    score += USER_ALERT_WEIGHT[a.severity];
    reasons.push(a.title);
  }
  if (userAlerts.length > 0) {
    if (user.privileged) {
      score += 15;
      reasons.push("Cuenta con privilegios administrativos");
    }
    if (!user.knownDevice) {
      score += 15;
      reasons.push("Último acceso desde un dispositivo desconocido");
    }
  }

  return { score: clamp(score), alerts: userAlerts.length, reasons };
}

/** Puntaje global de exposición de la organización (0-100). */
export function organizationRisk() {
  const topAssets = assets
    .map((a) => assetRisk(a).score)
    .sort((a, b) => b - a)
    .slice(0, 5);
  const assetComponent = topAssets.reduce((s, n) => s + n, 0) / topAssets.length;

  const active = alerts.filter(isAlertActive);
  const alertComponent = clamp(
    active.filter((a) => a.severity === "critica").length * 25 +
      active.filter((a) => a.severity === "alta").length * 12 +
      active.filter((a) => a.severity === "media").length * 4,
  );

  const open = vulnerabilities.filter(isVulnOpen);
  const vulnComponent = open.length ? (open.filter(isVulnOverdue).length / open.length) * 100 : 0;

  const score = clamp(assetComponent * 0.5 + alertComponent * 0.3 + vulnComponent * 0.2);
  return { score, level: riskLevel(score) };
}

export function dashboardSummary() {
  const activeAlerts = alerts.filter(isAlertActive);
  const openVulns = vulnerabilities.filter(isVulnOpen);
  return {
    activeIncidents: incidents.filter(isIncidentActive).length,
    criticalIncidents: incidents.filter((i) => isIncidentActive(i) && i.severity === "critica").length,
    activeAlerts: activeAlerts.length,
    criticalAlerts: activeAlerts.filter((a) => a.severity === "critica").length,
    openVulns: openVulns.length,
    overdueVulns: openVulns.filter(isVulnOverdue).length,
    suspiciousUsers: users.filter((u) => userRisk(u).score >= 50).length,
  };
}

/**
 * Riesgo para el negocio de una vulnerabilidad (0-100): el puntaje CVSS
 * ponderado por la criticidad del activo donde se encuentra.
 */
export function vulnerabilityRisk(v: Vulnerability) {
  const criticality = assetById(v.assetId)?.criticality ?? 3;
  return clamp(v.cvss * 10 * (0.6 + 0.08 * criticality));
}
