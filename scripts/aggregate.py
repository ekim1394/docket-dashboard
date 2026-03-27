"""
Aggregate regulatory data from R2 Parquet files into JSON for the dashboard.

Queries feed_summary.parquet via DuckDB + httpfs and produces:
  - public/data/dockets-by-year.json
  - public/data/comments-by-year.json
  - public/data/agency-activity.json
  - public/data/clusters.json
"""

import json
from pathlib import Path

import duckdb

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

R2_BASE_URL = "https://pub-5fc11ad134984edf8d9af452dd1849d6.r2.dev"
FEED_SUMMARY_URL = f"{R2_BASE_URL}/feed_summary.parquet"

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public" / "data"

# Administration periods (inclusive start, exclusive end)
ADMINISTRATIONS = [
    {"id": "clinton", "name": "Clinton", "start": "1993-01-20", "end": "2001-01-20"},
    {"id": "w-bush", "name": "W. Bush", "start": "2001-01-20", "end": "2009-01-20"},
    {"id": "obama", "name": "Obama", "start": "2009-01-20", "end": "2017-01-20"},
    {"id": "trump", "name": "Trump", "start": "2017-01-20", "end": "2021-01-20"},
    {"id": "biden", "name": "Biden", "start": "2021-01-20", "end": "2025-01-20"},
    {"id": "trump-2", "name": "Trump 2", "start": "2025-01-20", "end": None},
]

# Agency cluster mapping
CLUSTER_MAP: dict[str, str] = {}
_CLUSTER_DEFS: dict[str, list[str]] = {
    "environment": ["EPA", "DOE", "NOAA", "DOI", "USDA"],
    "health": ["FDA", "HHS", "CMS", "CDC", "NIH"],
    "finance": ["SEC", "CFTC", "FTC", "FDIC", "OCC", "CFPB"],
    "defense": ["DOD", "DHS", "VA"],
    "transportation": ["DOT", "FAA", "FMCSA", "NHTSA", "FRA"],
    "communications": ["FCC"],
}
for _cluster, _agencies in _CLUSTER_DEFS.items():
    for _agency in _agencies:
        CLUSTER_MAP[_agency] = _cluster

# Human-readable agency names (top agencies + cluster members)
AGENCY_NAMES: dict[str, str] = {
    "EPA": "Environmental Protection Agency",
    "DOE": "Department of Energy",
    "NOAA": "National Oceanic and Atmospheric Administration",
    "DOI": "Department of the Interior",
    "USDA": "Department of Agriculture",
    "FDA": "Food and Drug Administration",
    "HHS": "Department of Health and Human Services",
    "CMS": "Centers for Medicare & Medicaid Services",
    "CDC": "Centers for Disease Control and Prevention",
    "NIH": "National Institutes of Health",
    "SEC": "Securities and Exchange Commission",
    "CFTC": "Commodity Futures Trading Commission",
    "FTC": "Federal Trade Commission",
    "FDIC": "Federal Deposit Insurance Corporation",
    "OCC": "Office of the Comptroller of the Currency",
    "CFPB": "Consumer Financial Protection Bureau",
    "DOD": "Department of Defense",
    "DHS": "Department of Homeland Security",
    "VA": "Department of Veterans Affairs",
    "DOT": "Department of Transportation",
    "FAA": "Federal Aviation Administration",
    "FMCSA": "Federal Motor Carrier Safety Administration",
    "NHTSA": "National Highway Traffic Safety Administration",
    "FRA": "Federal Railroad Administration",
    "FCC": "Federal Communications Commission",
    "DOL": "Department of Labor",
    "DOJ": "Department of Justice",
    "ED": "Department of Education",
    "HUD": "Department of Housing and Urban Development",
    "SBA": "Small Business Administration",
    "TREAS": "Department of the Treasury",
    "STATE": "Department of State",
    "FERC": "Federal Energy Regulatory Commission",
    "NRC": "Nuclear Regulatory Commission",
    "IRS": "Internal Revenue Service",
    "USCIS": "U.S. Citizenship and Immigration Services",
    "CBP": "Customs and Border Protection",
    "OSHA": "Occupational Safety and Health Administration",
    "SSA": "Social Security Administration",
    "NASA": "National Aeronautics and Space Administration",
}


def get_cluster(agency_code: str) -> str:
    """Return the cluster name for an agency code, defaulting to 'other'."""
    return CLUSTER_MAP.get(agency_code, "other")


def get_agency_name(agency_code: str) -> str:
    """Return a human-readable name for an agency code."""
    return AGENCY_NAMES.get(agency_code, agency_code)


# ---------------------------------------------------------------------------
# DuckDB helpers
# ---------------------------------------------------------------------------


def create_connection() -> duckdb.DuckDBPyConnection:
    """Create a DuckDB in-memory connection with httpfs loaded."""
    con = duckdb.connect(":memory:")
    con.execute("INSTALL httpfs; LOAD httpfs;")
    con.execute("SET s3_region = 'auto';")
    return con


def feed_summary_ref() -> str:
    """Return a read_parquet() expression for feed_summary."""
    return f"read_parquet('{FEED_SUMMARY_URL}')"


# ---------------------------------------------------------------------------
# Aggregation queries
# ---------------------------------------------------------------------------


def build_dockets_by_year(con: duckdb.DuckDBPyConnection) -> list[dict]:
    """
    Count dockets per year, broken down by agency cluster.

    Returns list of {year, total, environment, health, finance, defense,
    transportation, communications, other}.
    """
    print("  Querying dockets by year...")

    # Get per-agency-code, per-year counts
    rows = con.execute(f"""
        SELECT
            YEAR(CAST(COALESCE(date_created, modify_date) AS DATE)) AS year,
            agency_code,
            COUNT(*) AS cnt
        FROM {feed_summary_ref()}
        WHERE YEAR(CAST(COALESCE(date_created, modify_date) AS DATE)) >= 2000
        GROUP BY year, agency_code
        ORDER BY year
    """).fetchall()

    # Aggregate into clusters per year
    year_data: dict[int, dict[str, int]] = {}
    for year, agency_code, cnt in rows:
        if year is None:
            continue
        year = int(year)
        if year not in year_data:
            year_data[year] = {
                "year": year,
                "total": 0,
                "environment": 0,
                "health": 0,
                "finance": 0,
                "defense": 0,
                "transportation": 0,
                "communications": 0,
                "other": 0,
            }
        cluster = get_cluster(agency_code)
        year_data[year][cluster] += int(cnt)
        year_data[year]["total"] += int(cnt)

    result = sorted(year_data.values(), key=lambda d: d["year"])
    print(f"  -> {len(result)} years of docket data")
    return result


def build_comments_by_year(con: duckdb.DuckDBPyConnection) -> list[dict]:
    """
    Sum comment_count per year from feed_summary.

    Returns list of {year, total}.
    """
    print("  Querying comments by year...")

    rows = con.execute(f"""
        SELECT
            YEAR(CAST(COALESCE(date_created, modify_date) AS DATE)) AS year,
            SUM(comment_count) AS total
        FROM {feed_summary_ref()}
        WHERE YEAR(CAST(COALESCE(date_created, modify_date) AS DATE)) >= 2000
        GROUP BY year
        ORDER BY year
    """).fetchall()

    result = [
        {"year": int(year), "total": int(total)}
        for year, total in rows
        if year is not None
    ]
    print(f"  -> {len(result)} years of comment data")
    return result


def build_agency_activity(con: duckdb.DuckDBPyConnection) -> list[dict]:
    """
    Count dockets per agency per administration period.

    Returns list of {adminId, agencyCode, agencyName, cluster, docketCount},
    sorted by docketCount descending within each admin.
    """
    print("  Querying agency activity by administration...")

    result: list[dict] = []

    for admin in ADMINISTRATIONS:
        admin_id = admin["id"]
        start = admin["start"]
        end = admin["end"]

        if end is not None:
            date_filter = f"""
                CAST(COALESCE(date_created, modify_date) AS DATE) >= '{start}'
                AND CAST(COALESCE(date_created, modify_date) AS DATE) < '{end}'
            """
        else:
            date_filter = f"""
                CAST(COALESCE(date_created, modify_date) AS DATE) >= '{start}'
            """

        rows = con.execute(f"""
            SELECT
                agency_code,
                COUNT(*) AS docket_count
            FROM {feed_summary_ref()}
            WHERE {date_filter}
            GROUP BY agency_code
            ORDER BY docket_count DESC
        """).fetchall()

        for agency_code, docket_count in rows:
            result.append({
                "adminId": admin_id,
                "agencyCode": agency_code,
                "agencyName": get_agency_name(agency_code),
                "cluster": get_cluster(agency_code),
                "docketCount": int(docket_count),
            })

    print(f"  -> {len(result)} agency-admin rows")
    return result


def build_clusters(con: duckdb.DuckDBPyConnection) -> dict:
    """
    Build cluster metadata.

    Returns {
        mappings: [{agencyCode, cluster}, ...],
        byAdmin: [{adminId, cluster, docketCount, percentage}, ...]
    }
    """
    print("  Building cluster aggregations...")

    # Static mappings from the cluster definitions
    mappings = [
        {"agencyCode": agency, "cluster": cluster}
        for cluster, agencies in _CLUSTER_DEFS.items()
        for agency in agencies
    ]

    # Cluster totals per administration
    by_admin: list[dict] = []

    for admin in ADMINISTRATIONS:
        admin_id = admin["id"]
        start = admin["start"]
        end = admin["end"]

        if end is not None:
            date_filter = f"""
                CAST(COALESCE(date_created, modify_date) AS DATE) >= '{start}'
                AND CAST(COALESCE(date_created, modify_date) AS DATE) < '{end}'
            """
        else:
            date_filter = f"""
                CAST(COALESCE(date_created, modify_date) AS DATE) >= '{start}'
            """

        rows = con.execute(f"""
            SELECT
                agency_code,
                COUNT(*) AS docket_count
            FROM {feed_summary_ref()}
            WHERE {date_filter}
            GROUP BY agency_code
        """).fetchall()

        # Aggregate by cluster
        cluster_counts: dict[str, int] = {}
        admin_total = 0
        for agency_code, docket_count in rows:
            count = int(docket_count)
            cluster = get_cluster(agency_code)
            cluster_counts[cluster] = cluster_counts.get(cluster, 0) + count
            admin_total += count

        # Build rows with percentages
        for cluster, count in sorted(cluster_counts.items(), key=lambda x: -x[1]):
            pct = round(count / admin_total * 100, 1) if admin_total > 0 else 0.0
            by_admin.append({
                "adminId": admin_id,
                "cluster": cluster,
                "docketCount": count,
                "percentage": pct,
            })

    print(f"  -> {len(mappings)} cluster mappings, {len(by_admin)} admin-cluster rows")
    return {"mappings": mappings, "byAdmin": by_admin}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def write_json(data: object, filename: str) -> None:
    """Write data to a JSON file in the output directory."""
    path = OUTPUT_DIR / filename
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    size_kb = path.stat().st_size / 1024
    print(f"  Wrote {path} ({size_kb:.1f} KB)")


def main() -> None:
    print("=== Spicy Regs Dashboard: Data Aggregation ===")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"R2 source: {FEED_SUMMARY_URL}")
    print()

    # Ensure output directory exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Create DuckDB connection
    print("Initializing DuckDB with httpfs...")
    con = create_connection()
    print()

    # 1. Dockets by year
    print("[1/4] Dockets by year")
    dockets_by_year = build_dockets_by_year(con)
    write_json(dockets_by_year, "dockets-by-year.json")
    print()

    # 2. Comments by year
    print("[2/4] Comments by year")
    comments_by_year = build_comments_by_year(con)
    write_json(comments_by_year, "comments-by-year.json")
    print()

    # 3. Agency activity
    print("[3/4] Agency activity by administration")
    agency_activity = build_agency_activity(con)
    write_json(agency_activity, "agency-activity.json")
    print()

    # 4. Clusters
    print("[4/4] Cluster aggregations")
    clusters = build_clusters(con)
    write_json(clusters, "clusters.json")
    print()

    con.close()
    print("=== Done ===")


if __name__ == "__main__":
    main()
