# SpendPilot Development Log

## Project

SpendPilot — AI tooling cost audit platform

## Timeline

20 May 2026 → 23 May 2026

---

# 20 May 2026

## Initial Project Setup

### Completed

* Initialized SpendPilot using Create Next App
* Created landing page and dashboard UI
* Added audit form inputs for:

  * AI provider
  * plan
  * seats
  * team size
  * use case
* Drafted initial README and project overview
* Established initial Prisma schema for audits
* Created first report page structure

### Architecture Decisions

* Next.js App Router selected initially
* Prisma + PostgreSQL chosen for persistence
* Server Actions used for audit creation flow
* Planned AI-generated summaries using OpenRouter

### Problems Encountered

* Early Prisma migration inconsistencies
* Confusion between future report structure and raw audit input structure
* Initial report rendering depended on incomplete database shape assumptions

### Fixes

* Simplified initial schema
* Centralized audit creation logic
* Added baseline audit result model

### Estimated Work Duration

~5–6 hours

---

# 21 May 2026

## Report System + Audit Engine Expansion

### Major Features Built

* Built dedicated report route
* Added report page UI with:

  * metadata section
  * savings overview
  * recommendations panel
  * AI summary section
* Introduced recommendation engine
* Added provider-specific optimization logic
* Added savings calculations
* Added recommendation persistence layer
* Added server-side summary generation flow

### Audit Engine Improvements

Implemented provider-specific logic for:

* ChatGPT
* Claude
* Cursor
* GitHub Copilot
* Gemini
* Windsurf

### Recommendation Logic Added

Examples:

* unused seat detection
* oversized enterprise plan detection
* team downgrade recommendations
* excessive premium-seat usage detection

### Database Refactors

* Removed legacy nested `result` assumptions
* Flattened audit financial fields directly into Audit model
* Removed outdated schema assumptions from old migrations
* Began migration cleanup work

### Major Bugs Encountered

#### 1. Report Rendering Crashes

The report page repeatedly failed during server rendering.

Root causes discovered:

* old route assumptions
* undefined fields
* schema drift
* invalid Prisma reads
* incomplete recommendation data

#### 2. Navigation Failures

Form submission occasionally completed successfully but navigation silently failed.

#### 3. Prisma Environment Problems

Prisma client instantiation repeatedly broke during deployment and local execution.

### Fixes Applied

* Added extensive logging across:

  * report rendering
  * audit creation
  * summary generation
  * navigation flow
* Refactored audit persistence flow
* Added safer handling for undefined values
* Added fallback UI states
* Removed slug dependency gradually
* Introduced stricter report data mapping

### Estimated Work Duration

~8–10 hours

---

# 22 May 2026

## Large Refactor + Debugging Marathon

This was the most unstable development phase.

### Core Work Completed

#### Audit Engine Rewrite

* Added detailed provider rules
* Added realistic pricing-based calculations
* Introduced recommendation scoring logic
* Added centralized AI pricing map
* Added normalized plan handling
* Reworked savings calculations

#### Dashboard Improvements

* Added automatic monthly spend calculation
* Added reactive pricing updates based on:

  * provider
  * plan
  * seat count
* Added improved validation handling
* Added stricter form submission flow
* Added loading/error handling

#### Report Page Work

* Removed slug-based routing entirely
* Migrated fully to id-based routing
* Added report page fallback handling
* Added safer rendering patterns
* Added defensive formatting logic

### Major Technical Problems Faced

#### 1. Next.js 16 Async Params Issue

Discovered that:

* App Router params became async in Next.js 16
* old synchronous param access caused report route crashes

This caused:

* invalid Prisma queries
* failed server renders
* missing report pages

### Fix

Updated report page to await params correctly before querying Prisma.

---

#### 2. React Error #321

A persistent production React hydration/rendering error repeatedly appeared.

Symptoms:

* report page loaded partially
* client crashed afterward
* "This page couldn't be loaded" appeared

### Root Causes Identified

* undefined values during render
* invalid `.toLocaleString()` calls
* inconsistent data between server/client
* missing fallbacks
* stale assumptions about slug fields

### Fixes

* added render fallbacks
* removed slug dependencies
* added safe guards for numeric formatting
* simplified report client structure
* normalized database payloads

---

#### 3. Prisma Instantiation Failures

A custom Prisma configuration caused runtime crashes.

Symptoms:

* report page failed instantly
* logs never appeared
* Prisma client initialization exploded

### Fix

Replaced custom client initialization with official Prisma docs configuration.

Result:

* report route immediately started rendering again

---

#### 4. AI Summary Pipeline Failure

The AI summary generation silently stopped executing.

Symptoms:

* summary remained null
* generation logs never appeared
* no thrown errors

### Investigation

Tracked through:

* createAudit
* storeAudit
* async summary execution
* Prisma update flow
* OpenRouter calls

### Findings

The async summary flow was not consistently awaited or persisted correctly during refactors.

### Fixes

* improved logging
* stabilized async execution flow
* added summary update handling
* introduced fallback summary generation

---

### Infrastructure Changes

* temporarily moved away from Neon
* experimented with Supabase due to latency/runtime inconsistencies
* improved database synchronization behavior

### Estimated Work Duration

~12–14 hours

---

# 23 May 2026

## Stabilization + Calculation Accuracy

### Features & Improvements

* finalized pricing calculations
* normalized plan casing
* fixed mismatched provider plans
* improved recommendation generation
* improved decimal/string rendering
* refined dashboard calculations
* added modern summary-loading states
* improved error resilience

### Product-Level Work

* finalized product blueprints
* finalized marketing/system architecture planning
* refined overall project positioning

### Major Discoveries

#### Lowercase Normalization Was Critical

A major issue existed where:

* frontend plans used capitalized values
* backend pricing keys used lowercase values

This caused:

* missing recommendations
* zero savings
* incorrect pricing
* empty audit results

### Fix

Normalized plans using:

* `plan.toLowerCase()`
* lowercased lookup keys everywhere

Result:

* recommendation engine finally started producing valid outputs consistently

---

## Overall Technical Lessons Learned

### Next.js App Router

Major pain points encountered:

* async params changes
* inconsistent server/client behavior
* opaque production errors
* difficult debugging workflow

### Prisma

Key lessons:

* keep client initialization simple
* avoid overengineering Prisma setup early
* schema drift becomes extremely painful fast

### Architecture

Biggest improvement came from:

* simplifying data flow
* flattening audit structure
* normalizing values early
* centralizing pricing logic

---

# Final Status As Of 23 May 2026

## Working

* Audit creation
* Provider pricing calculations
* Recommendation generation
* Report persistence
* Report rendering
* Dashboard workflow
* Savings calculations
* Dynamic pricing updates

## Partially Stable

* AI summary generation pipeline
* Production error resilience
* Loading states

## Remaining Work

* polling/realtime summary updates
* cleaner loading experience
* stronger typing cleanup
* analytics/history system
* export/share report support
---

# 24 May 2026


## Features and Improvements 
* Added share link option 
* Added new ui elements 


## Finalizing 
* Done polishing project.
