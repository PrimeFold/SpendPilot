# Test Documentation

This project uses Jest alongside `ts-jest` to execute deterministic unit tests checking computational precision inside the math core boundaries.

## Testing Environments & Configuration

- **Framework:** Jest v29+
- **Runtime:** Node.js (via `ts-jest` compilation layers)
- **Execution Target:** `tests/audit-engine.test.ts`

## Automated Test Suites Breakdown

The test suite runs 5 isolated integration vectors to simulate real-world B2B procurement anomalies:

1. **`should calculate savings for unassigned ghost seats`**
   - *Target:* Verifies that when purchased seats exceed the active team size, overhead leakage is computed using the dynamic seat price multiplier.
2. **`should recommend downgrading for tiny teams on premium plans`**
   - *Target:* Validates that teams under 3 users flagged on bloated Team/Business pipelines are routed to downgrade pathways.
3. **`should apply a 20% Credex credit discount if monthly spend is >= $500`**
   - *Target:* Confirms that the high-volume operational threshold triggers a 20% flat discount recommendation card.
4. **`should flag a structural mismatch if Cursor is used purely for writing`**
   - *Target:* Catches role alignment discrepancies where code editors are erroneously supplied to non-technical users.
5. **`should calculate zero waste for a perfectly optimized team layout`**
   - *Target:* Guarantees that a completely optimized, zero-overhead subscription model resolves to exactly $0 in waste.

## How to Execute Locally

To run the full test suite with detailed logging flags activated, execute this command in your terminal core:

```bash
npm run test