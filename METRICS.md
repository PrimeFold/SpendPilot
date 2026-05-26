# Product Analytics Framework

## The North Star Metric
Our operational North Star Metric is **Total Verifiable Financial Waste Surfaced (USD per week)**. 

### Rationale
Because this utility functions primarily as a high-intent lead generator for Credex’s infrastructure marketplace, our core value indicator is proving to engineering leaders that they are overspending. The larger the total waste metric we surface, the stronger the psychological trigger to book a consultation with Credex to capture those savings.

## Core Operational Input Metrics
To shift our North Star metric upward, our development tracking monitors three distinct operational inputs:
1. **Form Conversion Completion Velocity (CV):** The total percentage of anonymous organic visitors who transition from entering their metrics to clicking the "Run Audit" button.
2. **High-Value Lead Captures ($\ge$ $500/mo Leak Ratio):** The metric tracking what percentage of users surface high overspend numbers, which qualifies them for direct corporate credit outreach.
3. **Consolidated Dynamic URL Share Rate:** The calculation tracking how many report views prompt a user to copy the unique link hash or share the visualization across public streams.

## Instrumentation Blueprint
We will use **PostHog** for product analytics. We will instrument custom event triggers on the client-side component layout:
- `form_input_changed`: Tracked to watch for users who drop off halfway through selecting their tool context.
- `audit_results_rendered`: Fired the moment the backend response resolves and maps out the savings header block.
- `consultation_cta_clicked`: Captures high-intent clicks routing out to the calendar booking interface.

## System Pivot Parameters
Because this application is built for high-leverage lead generation rather than Daily Active User (DAU) retention, our pivot trigger is tied to funnel conversion efficiency:

> **The Pivot Trigger:** If after **1,000 completed audits**, our conversion path from *"High-Value Waste Surfaced"* $\rightarrow$ *"Credex Consultation Booking"* sits at **less than 0.5%**, it proves that while the tool calculates well, it is failing to communicate commercial trust. This will instantly trigger a UX pivot to redesign the summary reports into a strict, formal CFO-ready downloadable format.