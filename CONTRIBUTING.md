# Contributing to Spicy Regs Dashboard

Welcome! This project is designed for contributors of **all experience levels**, including first-time programmers. You don't need to know React — there are issues for every skill level.

> **New to open source or GitHub?** Start with the [Onboarding Guide](ONBOARDING.md) — it maps issues to your skill level and includes a full Git/GitHub walkthrough.

## Quick Start

```bash
git clone https://github.com/civictechdc/spicy-regs-dashboard.git
cd spicy-regs-dashboard
npm install
npm run dev
```

Open http://localhost:3000/spicy-regs-dashboard in your browser. That's it!

## How the Project Works

This is a **static dashboard** — there's no database, no API, no backend. The data pipeline is:

```
Parquet files on Cloudflare R2  →  Python script  →  JSON files  →  React charts
```

1. **`scripts/aggregate.py`** queries public regulatory data and generates small JSON files
2. **`public/data/*.json`** contains the pre-computed data (committed to the repo)
3. **`src/components/charts/`** has React components that render charts from that JSON
4. **Next.js** builds it all into a static site deployed to GitHub Pages

## How to Add a Chart

This is the easiest way to contribute! Each chart is a **single file** in `src/components/charts/`.

### Step 1: Pick an Issue

Look for issues labeled **"good first issue"** on GitHub. Each one describes:
- What to visualize
- Which JSON file to use
- A mockup of the expected output

### Step 2: Understand the Data

The JSON files in `public/data/` are small and readable:

| File | What's in it |
|------|-------------|
| `administrations.json` | President names, parties, dates |
| `dockets-by-year.json` | Yearly docket counts by agency cluster |
| `comments-by-year.json` | Yearly public comment volume |
| `agency-activity.json` | Per-agency counts per administration |
| `clusters.json` | Agency-to-cluster mapping and totals |

### Step 3: Create Your Component

Create a new file in `src/components/charts/`. Here's a minimal example:

```tsx
/**
 * MyNewChart — Description of what this chart shows.
 *
 * Data: dockets-by-year.json (public/data/)
 */
"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import data from "@/../public/data/dockets-by-year.json";
import type { DocketsByYear } from "@/lib/types";
import Card from "@/components/ui/Card";

interface MyNewChartProps {
  activeAdmin: string | null;
}

export default function MyNewChart({ activeAdmin }: MyNewChartProps) {
  const chartData = data as DocketsByYear[];

  return (
    <Card title="My New Chart">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="year" tick={{ fill: "#71717a", fontSize: 12 }} />
          <YAxis tick={{ fill: "#71717a", fontSize: 12 }} />
          <Bar dataKey="total" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
```

### Step 4: Add It to the Page

Open `src/app/page.tsx` and:
1. Import your component
2. Add it to the charts grid
3. Pass `activeAdmin` as a prop

### Step 5: Test and Submit

```bash
npm run dev    # Check it looks right
npm run lint   # Make sure code passes lint
npm run build  # Verify the build works
```

Then open a pull request! If you're new to Git, see the [step-by-step walkthrough](ONBOARDING.md#git--github-walkthrough).

## Non-Code Contributions

Not ready to write code? You can still help:
- **Write content** — Issue [#4](https://github.com/ekim1394/docket-dashboard/issues/4) needs explanatory text, not code
- **Test the dashboard** — Try it in your browser, report bugs
- **Review PRs** — Read other people's changes and leave feedback
- **Improve docs** — Fix typos, clarify confusing sections

## How to Update Data

If the data needs to be refreshed:

```bash
# Requires Python 3.10+ and uv (or pip)
uv run --with duckdb python scripts/aggregate.py
```

This regenerates all JSON files in `public/data/`. The script queries public Parquet files — no API keys needed.

## Code Style

- **TypeScript** — strict mode, all props typed
- **Tailwind CSS** — utility classes, dark theme (zinc palette)
- **Recharts** — for charts (BarChart, AreaChart, etc.)
- **No complex state** — chart components import JSON directly, no `useEffect` or data fetching

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      ← Root layout (don't need to touch this)
│   └── page.tsx        ← Main dashboard page
├── components/
│   ├── charts/         ← ★ ADD YOUR CHARTS HERE ★
│   ├── layout/         ← Header, Footer, StatsRow
│   └── ui/             ← Reusable components (Card, etc.)
├── lib/
│   ├── types.ts        ← TypeScript interfaces for JSON data
│   ├── colors.ts       ← Color constants for parties and clusters
│   └── utils.ts        ← Helper functions (formatCount, etc.)
```

## Getting Help

- **Slack**: #spicy-regs channel in the [CivicTechDC Slack](https://civictechdc.org)
- **GitHub Issues**: Ask questions on any issue
- **Hack Nights**: Join a CivicTechDC hack night for in-person help
