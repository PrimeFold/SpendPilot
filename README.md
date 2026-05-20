# SpendPilot

> **Audit Your AI Spend in 60 Seconds**
>
> A production-grade SaaS application that helps startups discover overspending on AI tools such as Cursor, Claude, ChatGPT, GitHub Copilot, and API providers, then recommends actionable cost-saving opportunities and routes high-value leads to Credex.

---

# 🚀 Executive Summary

SpendPilot is a free web application that performs an automated financial audit of a company's AI tooling stack.

Users enter:

- Which AI tools they use
- Subscription plans
- Monthly spend
- Number of seats
- Team size
- Primary use case

The application then:

1. Detects overspending and inefficiencies
2. Recommends cheaper plans or alternatives
3. Calculates monthly and annual savings
4. Generates an AI-personalized executive summary
5. Captures leads after delivering value
6. Sends confirmation emails
7. Creates shareable public reports with Open Graph previews

This project is designed to feel like a real SaaS product that could be launched on Product Hunt tomorrow.

---

# 🏆 Why This Project Wins

This assignment evaluates far more than coding ability. It measures:

- Entrepreneurial thinking
- Product sense
- Engineering discipline
- Business understanding
- Communication
- Consistency over time

SpendPilot is intentionally positioned as:

- A useful product for startup founders
- A viral lead-generation engine
- A financially defensible audit tool
- A polished, production-ready application

---

# 🏷️ Project Name

# SpendPilot

### Tagline

**Audit Your AI Spend in 60 Seconds**

### Why This Name Works

- Memorable and professional
- Conveys optimization and guidance
- Sounds like a real B2B SaaS product
- Product Hunt friendly

### Alternative Names

- TokenTrim
- CreditScope
- SpendLens
- AI Spend Auditor

---

# 🎯 Target Users

Primary users:

- Startup founders
- CTOs
- Engineering managers
- AI-heavy product teams
- Indie hackers

Typical company stage:

- Seed to Series B
- 3–100 employees
- Spending $200–$10,000/month on AI tooling

---

# 🧠 Core Product Insight

Most startups are overspending on AI tools because:

- Teams buy subscriptions independently
- Plans are chosen without benchmarking
- Better alternatives are unknown
- Discounted credits are not considered

SpendPilot functions as a "Mint for AI Spend."

---

# 🛠 Tech Stack

## Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend

- Next.js Route Handlers
- Server Actions

## Database

- Supabase (PostgreSQL)

## Validation

- Zod

## AI Summary Generation

- Anthropic API

## Transactional Email

- Resend

## Rate Limiting

- Upstash Redis

## Testing

- Vitest

## CI/CD

- GitHub Actions

## Deployment

- Vercel

---

# 📁 Folder Structure

```text
spendpilot/
├── app/
│   ├── page.tsx
│   ├── audit/page.tsx
│   ├── report/[id]/page.tsx
│   ├── api/
│   │   ├── audit/route.ts
│   │   ├── lead/route.ts
│   │   ├── summary/route.ts
│   │   └── og/route.tsx
│   └── layout.tsx
│
├── components/
│   ├── landing/
│   ├── forms/
│   ├── audit/
│   ├── charts/
│   ├── shared/
│   └── ui/
│
├── lib/
│   ├── audit-engine.ts
│   ├── pricing.ts
│   ├── recommendations.ts
│   ├── ai-summary.ts
│   ├── email.ts
│   ├── rate-limit.ts
│   ├── supabase.ts
│   ├── validators.ts
│   └── utils.ts
│
├── types/
│   └── audit.ts
│
├── tests/
│   ├── audit-engine.test.ts
│   ├── recommendation.test.ts
│   └── summary.test.ts
│
├── public/
│
├── README.md
├── ARCHITECTURE.md
├── DEVLOG.md
├── REFLECTION.md
├── TESTS.md
├── PRICING_DATA.md
├── PROMPTS.md
├── GTM.md
├── ECONOMICS.md
├── USER_INTERVIEWS.md
├── LANDING_COPY.md
├── METRICS.md
├── .github/workflows/ci.yml
├── package.json
└── tsconfig.json
```

---

# 🗄 Database Schema

## audits

```sql
id uuid primary key
slug text unique
input jsonb
result jsonb
summary text
total_monthly_savings numeric
total_annual_savings numeric
created_at timestamptz default now()
```

## leads

```sql
id uuid primary key
audit_id uuid references audits(id)
email text not null
company_name text
role text
team_size integer
created_at timestamptz default now()
```

---

# 📋 Supported Tools

- Cursor
- GitHub Copilot
- Claude
- ChatGPT
- Anthropic API
- OpenAI API
- Gemini
- Windsurf

---

# 🧮 Audit Engine Logic

For each tool:

1. Determine current monthly cost
2. Analyze plan suitability
3. Check for lower-tier alternatives
4. Evaluate competitive substitutes
5. Estimate discounted credit savings
6. Generate rationale

### Example Rule

```ts
if (tool.name === "Cursor" && tool.seats <= 2 && tool.plan === "Business") {
  recommend("Downgrade to Pro");
  savings = (40 - 20) * tool.seats;
  reason = "Business features are unnecessary for small teams.";
}
```

---

# 📈 Output Structure

Each audit result contains:

```ts
{
  currentSpend: 800,
  recommendedSpend: 320,
  monthlySavings: 480,
  annualSavings: 5760,
  recommendations: [],
  personalizedSummary: "",
  qualifiesForCredex: true
}
```

---

# 🧠 AI Summary Prompt

The LLM receives:

- Tools used
- Current spend
- Recommendations
- Savings
- Business context

The model returns a concise ~100-word executive summary.

Fallback summaries are used if the API fails.

---

# ✉️ Lead Capture Flow

1. User sees savings first
2. User enters email to save report
3. Data is stored in Supabase
4. Confirmation email is sent via Resend
5. High-value leads are flagged for Credex

---

# 🔗 Shareable Public URLs

Each audit generates a unique URL:

```text
/report/startup-ai-audit-7f3a2c
```

Public reports exclude:

- Email address
- Company name

They include:

- Tools used
- Recommendations
- Savings totals
- AI summary

---

# 🖼 Open Graph Images

Dynamic OG images display:

- Total annual savings
- Main headline
- Product branding

Designed for:

- Twitter/X
- LinkedIn
- Slack
- Discord

---

# 🧪 Testing Strategy

Minimum of 5 automated tests covering:

1. Overkill plan detection
2. Optimal plan detection
3. Alternative tool recommendations
4. Savings calculations
5. Zero-savings honesty cases

### Example Test

```ts
it("downgrades Cursor Business for small teams", () => {
  const result = runAudit({
    tools: [
      {
        name: "Cursor",
        plan: "Business",
        seats: 2,
        monthlySpend: 80,
      },
    ],
  });

  expect(result.totalMonthlySavings).toBe(40);
});
```

---

# ⚙️ GitHub Actions Workflow

```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run lint
      - run: npm run test
```

---

# 📅 7-Day Execution Plan

## Day 1
- Read assignment thoroughly
- Finalize product scope
- Initialize repository
- Create DEVLOG entry
- Research pricing

## Day 2
- Build landing page
- Build persistent input form
- Set up database

## Day 3
- Implement audit engine
- Write unit tests

## Day 4
- Build results page
- Add charts and visual polish

## Day 5
- Integrate AI summary
- Implement lead capture and email

## Day 6
- Add shareable URLs and OG images
- Write documentation files

## Day 7
- Lighthouse optimization
- Final testing
- Deploy and submit

---

# 🎨 UI Design Principles

- Clean SaaS aesthetic
- Strong hero metrics
- Clear recommendation cards
- Mobile-first responsiveness
- Accessible color contrast
- Screenshot-worthy results page

---

# 📊 Visual Components

- Savings hero section
- Per-tool audit cards
- Bar chart comparing current vs optimized spend
- Credex CTA for high-savings users
- Share buttons

---

# 📝 Required Root Documentation Files

## Engineering

- README.md
- ARCHITECTURE.md
- DEVLOG.md
- REFLECTION.md
- TESTS.md
- PRICING_DATA.md
- PROMPTS.md
- .github/workflows/ci.yml

## Entrepreneurial

- GTM.md
- ECONOMICS.md
- USER_INTERVIEWS.md
- LANDING_COPY.md
- METRICS.md

---

# 📈 GTM Strategy Summary

Primary user:

- Technical founder at Seed–Series A startup

Acquisition channels:

- Reddit (`r/startups`, `r/SaaS`, `r/Entrepreneur`)
- Hacker News
- Indie Hackers
- X/Twitter founder communities
- Founder Slack groups

First 100 users:

- Personalized outreach
- Public launch posts
- Community engagement
- Referral sharing

---

# 💰 Economics Summary

Example assumptions:

- Average credit purchase value: $2,500
- Gross margin: 20%
- Gross profit per customer: $500
- Audit → consultation conversion: 8%
- Consultation → purchase conversion: 20%

Expected value per audit:

```text
0.08 × 0.20 × $500 = $8
```

If acquisition cost per audit is below $8, the funnel is profitable.

---

# 📏 North Star Metric

**Qualified audits completed per week**

Why this matters:

- Indicates delivered value
- Captures product usage
- Measures lead generation
- Correlates directly with revenue

---

# 📈 Success Metrics

Input metrics:

- Landing → form start rate
- Form completion rate
- Audit → email capture rate

Conversion metrics:

- Consultation booking rate
- Credit purchase rate

---

# 🧠 Reflection Themes

Use REFLECTION.md to demonstrate:

- Specific debugging stories
- Reversed architectural decisions
- Honest AI usage
- Self-assessment with evidence

---

# 💻 Recommended Commit Format

- feat: add persistent spend input form
- feat: implement audit engine recommendation rules
- fix: handle Anthropic API timeout fallback
- test: add coverage for Cursor downgrade logic
- docs: complete GTM and economics analysis

---

# 📸 README Assets

Include:

- 3+ screenshots
- 30-second Loom demo
- Live deployment link
- Installation instructions
- Five architecture trade-offs

---

# 🚀 Deployment Checklist

- All MVP features working
- Tests passing
- CI green
- Lighthouse scores above requirements
- Environment variables configured
- Shareable URLs working
- Emails sending successfully

---

# 🏅 What Recruiters Will Notice

This project demonstrates:

- Product thinking
- Full-stack engineering
- Testing discipline
- Business reasoning
- Documentation excellence
- Ability to ship under constraints

Most applicants will build a functional assignment.

Very few will build a product that feels investable.

SpendPilot should feel like a company.

---

# 🔥 Final Philosophy

The goal is not merely to satisfy the rubric.

The goal is to make the reviewer think:

> "This candidate already operates like a startup engineer and product owner. If they can produce this level of work in seven days, we want them on our team."

Build something that looks like it belongs on Product Hunt, not in a classroom.

Ship relentlessly.

Document your thinking.

And make it impossible to ignore.
