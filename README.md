# Spicy Regs Dashboard

A presidential regulatory timeline dashboard that visualizes U.S. federal regulatory dockets across administrations. Built by [CivicTechDC](https://civictechdc.org).

## What This Shows

- **Docket volume** by agency cluster over time
- **Public comment engagement** trends
- **Agency activity** rankings per administration
- **Regulatory focus** shifts between policy clusters (environment, health, finance, defense, etc.)

Data covers Clinton through the current administration (~2000–present), sourced from [regulations.gov](https://www.regulations.gov) via [Mirrulations](https://github.com/MoravianUniversity/mirrern).

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000/spicy-regs-dashboard

## Architecture

```
Cloudflare R2 (Parquet) → Python/DuckDB script → JSON files → Next.js static site → GitHub Pages
```

- **No backend, no API keys, no database** — the dashboard is a fully static site
- Data is pre-aggregated into small JSON files (~120KB total)
- Charts are self-contained React components using [Recharts](https://recharts.org)

## Contributing

This project is designed for **first-time contributors**.

- **New to open source?** Start with the [Onboarding Guide](ONBOARDING.md) — it matches issues to your skill level and walks you through Git/GitHub
- **Ready to code?** See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add a chart in 5 minutes

## Tech Stack

- [Next.js 16](https://nextjs.org) — React framework (static export)
- [Recharts](https://recharts.org) — Charting library
- [Tailwind CSS 4](https://tailwindcss.com) — Styling
- [DuckDB](https://duckdb.org) — Data aggregation (Python script only)
- [GitHub Pages](https://pages.github.com) — Hosting

## Data Update

```bash
uv run --with duckdb python scripts/aggregate.py
```

## Part of the Spicy Regs Ecosystem

| Project | Description |
|---------|-------------|
| [spicy-regs](https://github.com/civictechdc/spicy-regs) | ETL pipeline + main frontend |
| [spicy-regs-agent](https://github.com/civictechdc/spicy-regs-agent) | AI docket analysis agent |
| **spicy-regs-dashboard** | This project — presidential timeline dashboard |

## License

Open source under the [MIT License](LICENSE).
