# AI Prompt Library

## E2E Automation Coverage and Runbook
One prompt to add Playwright coverage for critical user journeys and document exactly how to run and evaluate the suite.

```md
Act as a senior QA automation engineer for this Angular project.

Task:
1. Add Playwright end-to-end test coverage for the core user journeys in the work-order timeline app.
2. Prioritize high-value flows first: create, edit, validation errors (including overlap conflicts), filtering/view changes, and any critical timeline interactions.
3. If testability gaps exist (missing selectors, flaky behavior, race conditions), make the minimum safe code changes required to improve testability.
4. Run the E2E suite and report what passes/fails.
5. Explain exactly how to run E2E tests and coverage generation in this repo, using the existing npm scripts if available.
6. If true 100% E2E coverage is not realistically measurable (because E2E coverage differs from unit/instrumentation coverage), explicitly state the limitation and instead provide a coverage matrix of critical user journeys completed vs. pending.

Constraints:
- Do not break existing behavior.
- Prefer stable selectors (`data-testid`) over brittle CSS/text selectors.
- Keep tests deterministic and avoid arbitrary waits.
- Summarize all file changes.

Output format:
- Coverage matrix (journey-by-journey)
- Test files added/updated
- Commands to run
- Results summary
- Remaining gaps / risks
```

## Unit Test Coverage Maximization
One prompt to expand Angular unit tests, run coverage, inspect gaps, and close meaningful branch/behavior coverage issues.

```md
Act as a senior Angular test engineer.

Task:
1. Review the entire codebase and add/expand unit tests for components, services, utilities, and model logic.
2. Run unit tests with coverage (`npm run test:coverage` or `ng test --watch=false --code-coverage`).
3. Read the generated coverage report and identify uncovered lines/branches/functions/files.
4. Add targeted tests to close meaningful gaps.
5. Repeat until coverage is maximized.
6. Report final coverage numbers and list any remaining uncovered code with reasons.

Important:
- Do not add meaningless tests only to inflate coverage.
- Prioritize behavioral tests, edge cases, validation logic, date calculations, and branch coverage.
- If 100% is not practical or would require testing framework internals/generated code, explain exactly why.
- Keep tests readable and maintainable.

Output format:
- Coverage before/after (if available)
- Files tested and key scenarios added
- Final coverage summary (Statements / Branches / Functions / Lines)
- Remaining gaps and rationale
- Commands used to run tests and open coverage report
```

## Principal Engineer Refactor and Architecture Review
One prompt for a codebase-wide Angular review focused on dead code removal, simplification, architecture quality, and safe refactors.

```md
Act as a principal Angular engineer performing a codebase-wide technical review and refactor.

Objectives:
1. Identify and remove dead code, unused files, and stale abstractions.
2. Find duplicate logic and consolidate it safely.
3. Simplify overly complex implementations without changing behavior.
4. Review project structure, naming conventions, and component/service boundaries for Angular best practices.
5. Ensure third-party libraries are used appropriately and not over/under-utilized.
6. Apply improvements directly (with minimal, safe refactors) and explain each change.

Focus areas:
- Component responsibilities and hierarchy
- State management/service boundaries
- Reusable utilities vs component-local logic
- Date handling and validation paths
- Template complexity and readability
- Testability and maintainability

Constraints:
- Preserve current behavior unless a bug is clearly identified.
- Prefer incremental refactors over large rewrites.
- Update/add tests when behavior changes or bug fixes are introduced.

Output format:
- Findings (ranked by severity/impact)
- Refactors applied (with file list)
- Behavior preserved vs changed
- Follow-up recommendations (optional)
```

## Deep Technical Review for Production Readiness
One prompt for a strict, prioritized engineering review of architecture, defects, risks, dependencies, and scaling readiness.

```md
Perform a deep technical review of this Angular codebase as if it is preparing for production scale.

Review goals:
- Identify architectural issues, defect patterns, performance bottlenecks, and maintainability risks.
- Flag dead code, duplicated logic, weak abstractions, and unnecessary dependencies.
- Evaluate folder structure, naming consistency, and component/service/module organization.
- Assess test strategy quality (unit + E2E coverage quality, not just percentages).
- Highlight code paths likely to fail under edge cases (date logic, overlap validation, UI state transitions).

For each finding, provide:
1. Severity (`Critical`, `High`, `Medium`, `Low`)
2. What is wrong
3. Why it matters (risk/impact)
4. Recommended fix
5. Example patch or code snippet (when useful)
6. Expected impact after the fix

Output sections (in order):
- Critical Issues
- High-Priority Improvements
- Medium Improvements
- Optional Enhancements
- Refactored Code Examples (if changes are proposed)
- Assumptions / Unknowns

Be precise and direct. Prioritize actionable engineering feedback over generic best practices.
```

## Angular App Build From Markdown and Screenshots
One prompt to build the app from a written spec and screenshots with Angular 21 and a clear component architecture.

```md
Build the application described in the provided markdown spec and screenshots using Angular 21.

Requirements:
- Match the functional behavior from the markdown spec.
- Match the visual layout and interaction patterns from the screenshots as closely as practical.
- Use clean Angular 21 architecture (standalone components/services, clear separation of concerns).
- Implement a maintainable component hierarchy and typed models.
- Add baseline unit tests for critical business logic.

Before coding:
- Summarize the feature set and assumptions.
- Propose a component/service/data model breakdown.

After coding:
- List files created/updated.
- Note any deviations from the spec/screenshots and why.
```

## Work Order Overlap Validation Logic
One prompt to implement inclusive overlap validation for create/edit flows with centralized logic and unit tests.

```md
Implement overlap validation for work orders within the same work center.

Rules:
- Date range intersection must be inclusive (shared start/end date counts as overlap).
- Validation must work for both create and edit flows.
- When editing, exclude the current work order from conflict checks.
- Return a user-friendly validation result/message that the UI can display.

Also:
- Add unit tests covering non-overlap, boundary overlap, contained ranges, exact match, and edit exclusions.
- Keep the logic centralized (service or utility) to avoid duplication.
```

## Reactive Form With ng-select and ng-bootstrap Datepicker
One prompt to implement form controls, validation, and date parsing/formatting using the selected UI libraries.

```md
Implement a reactive form for the work-order panel using:
- `ng-select` for the status field
- `ng-bootstrap` datepicker for date inputs

Requirements:
- Add proper form validation (required fields, date order validation).
- Use a consistent date parsing/formatting strategy (project-standard display format).
- Ensure edit mode pre-populates values correctly.
- Show validation messages in the template.
- Add unit tests for form validation and date parsing/formatting behavior.
```

## Styling and Visual Polish (Angular)
One prompt to improve SCSS and UI polish while preserving behavior, accessibility, and the existing visual language.

```md
Act as a senior frontend engineer. Improve the styling of this Angular component/page while preserving existing behavior and layout structure.

Goals:
- Make the UI feel polished and production-ready.
- Preserve the current visual language unless clearly inconsistent.
- Improve spacing, alignment, typography hierarchy, states (hover/focus/disabled/error), and responsiveness.
- Keep accessibility in mind (contrast, focus visibility, reduced motion if animations are added).

Constraints:
- Do not rewrite the component architecture unless required for styling.
- Minimize template changes; prefer SCSS improvements first.
- If markup changes are needed, explain why.

Deliverables:
- Updated SCSS (and minimal template changes if required)
- Summary of visual improvements
- Screenshots checklist / manual verification steps
```

## Date Calculations and Timeline Logic Audit
One prompt to review and harden date math, boundary logic, parsing/formatting behavior, and edge-case test coverage.

```md
Act as a senior TypeScript engineer reviewing date and timeline logic.

Task:
- Audit the date calculation utilities and timeline-related logic for off-by-one errors, inclusive/exclusive boundary issues, timezone assumptions, parsing/formatting mismatches, and invalid input handling.
- Refactor only where necessary for correctness and readability.
- Add focused unit tests for edge cases.

Focus on:
- Inclusive range math
- Start/end ordering validation
- Month/week/day transitions
- DST/timezone safety (if relevant)
- Display formatting consistency vs stored values

Output:
- Bugs found (if any)
- Code changes made
- New edge-case tests added
- Remaining assumptions
```

## Angular Debugging and Root Cause Fix
One prompt to diagnose a failing component/test, rank likely causes, implement the smallest reliable fix, and add regression coverage.

```md
Act as a debugging partner for this Angular project.

Problem:
[Paste the error message, failing test output, and relevant files]

Please:
1. Identify the most likely root cause(s), ranked.
2. Propose the smallest reliable fix first.
3. Implement the fix and explain why it works.
4. Add or update tests to prevent regression.
5. Call out any hidden risks or related issues.

Constraints:
- Do not mask the issue with brittle waits, broad mocks, or disabled assertions.
- Keep changes minimal and production-safe.
```

## Component Responsibility Split and Refactor
One prompt to review component overload and refactor responsibilities across component, service, utility, and template boundaries.

```md
Act as a principal Angular engineer. Review this component and decide whether responsibilities should be split across component, service, utility, and template.

Inputs:
- Component TS
- Template HTML
- SCSS
- Related tests (if any)

Tasks:
- Identify responsibility overload (UI state, business logic, mapping, validation, formatting, side effects).
- Propose a cleaner separation of concerns.
- Apply a minimal refactor that improves readability/testability without changing behavior.
- Update tests as needed.

Output:
- Before/after responsibility map
- Refactor summary
- Tradeoffs and follow-ups
```

## Targeted Test Coverage Gap Closure
One prompt to close meaningful unit/E2E coverage gaps with branch-focused tests instead of low-value coverage inflation.

```md
Review the current unit/E2E coverage and close meaningful gaps without writing low-value tests.

Requirements:
- Prioritize branch coverage in business logic and validation paths.
- Add tests for edge cases and regressions.
- Run coverage and report final numbers.
- List intentionally untested code (and why).

Avoid:
- Snapshot-only tests with no assertions of behavior
- Trivial tests that mirror implementation details
```

## Angular Production Readiness Review (Short Form)
One prompt to run a concise production-readiness assessment and return ranked issues, quick wins, and longer-term improvements.

```md
Do a production-readiness review of this Angular repo.

Evaluate:
- Correctness risks
- Test quality and gaps
- Error handling
- Accessibility basics
- Performance hotspots
- Maintainability and architecture
- Dependency hygiene

Output:
- Top 10 issues (ranked)
- Quick wins (high impact, low effort)
- Longer-term improvements
```
