/** Presidential administration */
export interface Administration {
  id: string;
  name: string;
  fullName: string;
  party: "democrat" | "republican";
  start: string;
  end: string | null;
}

/** Yearly docket counts broken down by agency cluster */
export interface DocketsByYear {
  year: number;
  total: number;
  environment: number;
  health: number;
  finance: number;
  defense: number;
  transportation: number;
  communications: number;
  other: number;
}

/** Yearly comment volume */
export interface CommentsByYear {
  year: number;
  total: number;
}

/** Per-agency docket counts within an administration */
export interface AgencyActivity {
  adminId: string;
  agencyCode: string;
  agencyName: string;
  cluster: string;
  docketCount: number;
}

/** Cluster totals per administration */
export interface ClusterData {
  adminId: string;
  cluster: string;
  docketCount: number;
  percentage: number;
}

/** Agency-to-cluster mapping */
export interface ClusterMapping {
  agencyCode: string;
  cluster: string;
}

/** Top-level clusters JSON structure */
export interface ClustersJson {
  mappings: ClusterMapping[];
  byAdmin: ClusterData[];
}
