import { NOW } from "./mock-data";
import type {
  AlertStatus,
  AssetType,
  IncidentStatus,
  Severity,
  VulnerabilityStatus,
} from "./types";

const TZ = "UTC";

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  }).format(new Date(iso));

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", timeZone: TZ }).format(new Date(iso));

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  }).format(new Date(iso));

/** Tiempo transcurrido respecto de "ahora" (fijo en los datos de ejemplo). */
export function timeAgo(iso: string) {
  const minutes = Math.round((new Date(NOW).getTime() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${Math.floor(hours / 24)} d`;
}

export const severityLabel: Record<Severity, string> = {
  critica: "Crítica",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const alertStatusLabel: Record<AlertStatus, string> = {
  nueva: "Nueva",
  en_investigacion: "En investigación",
  resuelta: "Resuelta",
  falso_positivo: "Falso positivo",
};

export const incidentStatusLabel: Record<IncidentStatus, string> = {
  abierto: "Abierto",
  en_contencion: "En contención",
  resuelto: "Resuelto",
};

export const vulnStatusLabel: Record<VulnerabilityStatus, string> = {
  abierta: "Abierta",
  en_progreso: "En progreso",
  resuelta: "Resuelta",
};

export const assetTypeLabel: Record<AssetType, string> = {
  servidor: "Servidor",
  base_de_datos: "Base de datos",
  aplicacion_web: "Aplicación web",
  endpoint: "Equipo",
  cloud: "Nube",
  red: "Red",
  api: "API",
};

export const environmentLabel = {
  produccion: "Producción",
  staging: "Staging",
  corporativo: "Corporativo",
} as const;
