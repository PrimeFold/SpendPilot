# System Architecture

## Data Flow Diagram
The following Mermaid diagram traces how a user input form submission transitions into a persistent, shareable, AI-summarized financial audit.

```mermaid
sequenceDiagram
    autonumber
    actor User as Startup Founder
    participant Client as Next.js Dashboard Client (Framer/Tailwind)
    participant Action as Next.js Server Action (createAudit)
    participant Engine as Deterministic Audit Engine (runAudit)
    participant DB as Postgres Database (Prisma ORM)
    participant AI as OpenRouter API (Llama-3.3-70b)

    User->>Client: Input team metrics & select tool configuration
    Client->>Client: Recompute Estimated Monthly Spend instantly via local cache
    User->>Client: Click "Run Audit"
    Client->>Action: Dispatch validated AuditInput object payload
    Action->>Engine: Run structural analysis against cost thresholds
    Engine->>Engine: Evaluate Ghost Seats, Overkill Tiers, Use-Case Alignment
    Engine-->>Action: Return calculated AuditResult + Recommendation[] array
    Action->>DB: Execute Prisma storeAudit() transaction (Write un-summarized record)
    DB-->>Action: Return generated unique UUID or CUID
    Action->>AI: Trigger async generateSummary() context payload prompt
    AI-->>Action: Return structured ~100-word executive brief markdown text
    Action->>DB: Update record by ID with text string
    Action-->>Client: Dispatch unique result ID token back to main thread
    Client->>User: Route router.push() to client-side public dynamic dynamic URL route