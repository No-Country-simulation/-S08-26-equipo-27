export type Severity = "critica" | "alta" | "media" | "baja";

export type AssetType =
  | "servidor"
  | "base_de_datos"
  | "aplicacion_web"
  | "endpoint"
  | "cloud"
  | "red"
  | "api";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  /** Importancia para el negocio, de 1 (baja) a 5 (crítica). */
  criticality: 1 | 2 | 3 | 4 | 5;
  environment: "produccion" | "staging" | "corporativo";
  owner: string;
  ip: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  privileged: boolean;
  lastLoginAt: string;
  lastLoginLocation: string;
  knownDevice: boolean;
}

export type EventSource = "Firewall" | "Antivirus" | "IAM" | "EDR" | "Cloud" | "Aplicación" | "Base de datos";

export interface SecurityEvent {
  id: string;
  timestamp: string;
  source: EventSource;
  type: string;
  severity: Severity;
  description: string;
  ip?: string;
  location?: string;
  userId?: string;
  assetId?: string;
}

export type AlertStatus = "nueva" | "en_investigacion" | "resuelta" | "falso_positivo";

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  status: AlertStatus;
  rule: string;
  createdAt: string;
  description: string;
  assetIds: string[];
  userId?: string;
  incidentId?: string;
}

export type IncidentStatus = "abierto" | "en_contencion" | "resuelto";

export interface TimelineEntry {
  at: string;
  kind: "evento" | "deteccion" | "accion";
  text: string;
  actor?: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  assignee: string;
  openedAt: string;
  resolvedAt?: string;
  summary: string;
  assetIds: string[];
  userIds: string[];
  alertIds: string[];
  timeline: TimelineEntry[];
  recommendedActions: string[];
}

export type VulnerabilityStatus = "abierta" | "en_progreso" | "resuelta";

export interface Vulnerability {
  id: string;
  cve: string;
  title: string;
  /** Puntaje CVSS de 0 a 10. */
  cvss: number;
  severity: Severity;
  assetId: string;
  detectedAt: string;
  dueDate: string;
  resolvedAt?: string;
  status: VulnerabilityStatus;
  assignee: string;
  /** Verdadero si ya se había resuelto y volvió a detectarse. */
  reappeared: boolean;
}
