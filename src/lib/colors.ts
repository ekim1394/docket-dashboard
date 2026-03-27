/** Party colors for administration timeline */
export const PARTY_COLORS = {
  democrat: "#1a4480",
  republican: "#b52027",
} as const;

/** Cluster colors for charts */
export const CLUSTER_COLORS: Record<string, string> = {
  environment: "#4CAF50",
  health: "#2196F3",
  finance: "#FF9800",
  defense: "#9C27B0",
  transportation: "#009688",
  communications: "#FFC107",
  other: "#607D8B",
};

/** Cluster display names */
export const CLUSTER_LABELS: Record<string, string> = {
  environment: "Environment",
  health: "Health",
  finance: "Finance",
  defense: "Defense & Security",
  transportation: "Transportation",
  communications: "Communications",
  other: "Other",
};

/** Agency code to cluster mapping */
export const AGENCY_CLUSTERS: Record<string, string> = {
  // Environment
  EPA: "environment",
  DOE: "environment",
  NOAA: "environment",
  DOI: "environment",
  USDA: "environment",
  // Health
  FDA: "health",
  HHS: "health",
  CMS: "health",
  CDC: "health",
  NIH: "health",
  // Finance
  SEC: "finance",
  CFTC: "finance",
  FTC: "finance",
  FDIC: "finance",
  OCC: "finance",
  CFPB: "finance",
  // Defense & Security
  DOD: "defense",
  DHS: "defense",
  VA: "defense",
  // Transportation
  DOT: "transportation",
  FAA: "transportation",
  FMCSA: "transportation",
  NHTSA: "transportation",
  FRA: "transportation",
  // Communications
  FCC: "communications",
};

/** Get the cluster for an agency code, defaulting to "other" */
export function getCluster(agencyCode: string): string {
  return AGENCY_CLUSTERS[agencyCode.toUpperCase()] ?? "other";
}
