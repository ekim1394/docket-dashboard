# New Contributor Onboarding Guide

Welcome! This guide helps you find the right starting point based on **your current skills** — no specific tech stack experience required. Whether you know R, Python, SQL, or just want to help with writing, there's a way to contribute.

## Find Your Starting Point

### "I know some R / Python / SQL and data viz tools"

Your data skills transfer directly! This project uses similar concepts (aggregation, filtering, charting) in a different stack. Here's how to bridge the gap:

1. **Start with Issue [#4 — Add an About section](https://github.com/ekim1394/docket-dashboard/issues/4)** — it's pure writing + basic HTML. No programming required.
2. **Then try Issue [#5 — Year-over-year change indicators](https://github.com/ekim1394/docket-dashboard/issues/5)** — it's basically percentage math + display, which maps to your stats background.
3. **Work up to chart issues** once you're comfortable with the codebase.

**Tutorials to bridge the gap:**
- [MDN HTML in 30 minutes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started) — basic page structure
- [Tailwind CSS utility-first concepts](https://tailwindcss.com/docs/utility-first) — how styling works in this project (it's like inline styles but cleaner)
- [React quick start](https://react.dev/learn) — focus on "Your First Component" and "Passing Props" (skip the rest until you need it)

### "I know some HTML / CSS but not React"

You can contribute to layout and styling issues right away:
- **Issue [#3 — Responsive mobile layout](https://github.com/ekim1394/docket-dashboard/issues/3)** — pure Tailwind CSS, no React logic
- **Issue [#8 — Dark/light mode toggle](https://github.com/ekim1394/docket-dashboard/issues/8)** — mostly CSS with a small bit of React state
- **Issue [#4 — About section](https://github.com/ekim1394/docket-dashboard/issues/4)** — HTML text content

### "I know JavaScript / React"

Jump straight into chart issues:
- **Issue [#2 — Timeline tooltips](https://github.com/ekim1394/docket-dashboard/issues/2)** — single file, React state + hover events
- **Issue [#5 — Year-over-year indicators](https://github.com/ekim1394/docket-dashboard/issues/5)** — single file, basic math
- **Issue [#6 — Keyboard navigation](https://github.com/ekim1394/docket-dashboard/issues/6)** — single file, event handlers + ARIA

### "I know Python + SQL"

The data pipeline is your domain:
- **Issue [#7 — Top Commented Dockets chart](https://github.com/ekim1394/docket-dashboard/issues/7)** — add a DuckDB query to `scripts/aggregate.py`
- **Issue [#1 — Docket Type pie chart](https://github.com/ekim1394/docket-dashboard/issues/1)** — new aggregation + chart component

### "I don't code (or I'm just getting started)"

You can still contribute! Here's how:
- **Issue [#4 — About section](https://github.com/ekim1394/docket-dashboard/issues/4)** — write explanatory content about federal rulemaking
- **Test the dashboard** — open it in your browser, find bugs, file issues
- **Review pull requests** — read other people's changes and leave feedback
- **Improve documentation** — fix typos, clarify confusing sections, add examples

## Issue Difficulty Guide

Not all "good first issue" labels are equal. Here's a more honest breakdown:

| Difficulty | Issues | Skills needed | Time estimate |
|-----------|--------|--------------|---------------|
| **No code** | [#4](https://github.com/ekim1394/docket-dashboard/issues/4) (About section) | Writing, basic HTML | 1-2 hours |
| **CSS only** | [#3](https://github.com/ekim1394/docket-dashboard/issues/3) (Mobile layout) | Tailwind CSS | 1-2 hours |
| **Single file, small React** | [#2](https://github.com/ekim1394/docket-dashboard/issues/2) (Tooltips), [#5](https://github.com/ekim1394/docket-dashboard/issues/5) (Stats), [#6](https://github.com/ekim1394/docket-dashboard/issues/6) (Keyboard nav) | JavaScript, basic React | 2-3 hours |
| **CSS + React state** | [#8](https://github.com/ekim1394/docket-dashboard/issues/8) (Dark/light mode) | CSS, React state, localStorage | 2-4 hours |
| **Python + React** | [#1](https://github.com/ekim1394/docket-dashboard/issues/1) (Pie chart), [#7](https://github.com/ekim1394/docket-dashboard/issues/7) (Top dockets) | Python, SQL/DuckDB, React, Recharts | Half day |

## Git & GitHub Walkthrough

If you've never contributed to a project on GitHub, here's exactly what to do.

### One-time setup

```bash
# 1. Fork the repo — click "Fork" at https://github.com/ekim1394/docket-dashboard

# 2. Clone YOUR fork (not the original)
git clone https://github.com/YOUR-USERNAME/docket-dashboard.git
cd docket-dashboard

# 3. Install dependencies and start the dev server
npm install
npm run dev
# Open http://localhost:3000/spicy-regs-dashboard in your browser
```

### For each contribution

```bash
# 1. Make sure you're on the main branch and up to date
git checkout main
git pull origin main

# 2. Create a branch for your work (name it after what you're doing)
git checkout -b add-about-section

# 3. Make your changes — edit files, test in the browser

# 4. Check what you changed
git status        # shows which files changed
git diff          # shows what changed inside them

# 5. Stage your changes (add the specific files you changed)
git add src/app/page.tsx src/components/about/AboutSection.tsx

# 6. Commit with a short message describing what you did
git commit -m "Add About section explaining the dashboard and data sources"

# 7. Push your branch to your fork
git push -u origin add-about-section

# 8. Open a Pull Request
#    Go to your fork on GitHub — you'll see a banner saying
#    "Compare & pull request". Click it, write a short description,
#    and submit!
```

### Key terms

| Term | What it means |
|------|--------------|
| **Repository (repo)** | The project's folder, tracked by Git |
| **Fork** | Your personal copy of someone else's repo |
| **Branch** | An isolated workspace for one set of changes |
| **Commit** | A saved snapshot of your changes, with a message |
| **Pull Request (PR)** | A request to merge your changes into the main project |
| **Main branch** | The "official" version of the code |
| **Staging (git add)** | Selecting which changes to include in your next commit |

### Common situations

**"I made changes but I'm not sure they're right"**
That's fine! Open a PR anyway and mark it as a draft (there's a dropdown on the "Create pull request" button). Maintainers can review and give feedback.

**"Someone else changed the same file"**
This is called a merge conflict. Don't panic — ask for help in the PR comments or on Slack. Maintainers can help you resolve it.

**"I accidentally committed something wrong"**
You can make a new commit that fixes it. No need to undo anything — just fix it and commit again.

**"I don't know if my code is good enough"**
Submit it! The PR review process exists precisely for this. Nobody expects perfection on the first try. Reviewers will help you improve it.

## Before You Submit

Run these checks locally to save review time:

```bash
npm run lint    # checks code style
npm run build   # verifies everything compiles
```

If either fails, read the error message — it usually tells you exactly what to fix. If you're stuck, paste the error in your PR description and ask for help.

## Getting Help

- **Slack**: #spicy-regs channel in the [CivicTechDC Slack](https://civictechdc.org)
- **GitHub Issues**: Comment on any issue to ask questions
- **Hack Nights**: Join a [CivicTechDC hack night](https://civictechdc.org) for in-person help
- **PR comments**: Maintainers review all PRs and give feedback — don't be shy about submitting!
