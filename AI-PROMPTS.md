# AI Prompt Library

## E2E Automation Coverage and Runbook

Prompt for adding Playwright coverage for critical user journeys and documenting exactly how to run and evaluate the suite.

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

Prompt for expanding Angular unit tests, running coverage, inspecting gaps, and closing meaningful branch/behavior coverage issues.

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

Prompt for a codebase-wide Angular review focused on dead code removal, simplification, architecture quality, and safe refactors.

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

Prompt for a strict, prioritized engineering review of architecture, defects, risks, dependencies, and scaling readiness.

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

Prompt for building the app from a written spec and screenshots with Angular 21 and a clear component architecture.

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

Prompt for implementing inclusive overlap validation for create/edit flows with centralized logic and unit tests.

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

Prompt for implementing form controls, validation, and date parsing/formatting using the selected UI libraries.

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

## Component Responsibility Split and Refactor

Prompt for reviewing component overload and refactoring responsibilities across component, service, utility, and template boundaries.

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

Prompt for closing meaningful unit/E2E coverage gaps with branch-focused tests instead of low-value coverage inflation.

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

## Angular Accessibility Audit and Safe Markup Fixes (WCAG 2.2 AA)

Prompt for auditing and fixing Angular accessibility issues with markup-only, behavior-preserving changes.

```md
You are a senior Accessibility Engineer (WCAG 2.2 AA) auditing and fixing an existing Angular application.

GOAL
Make the entire Angular app accessibility-friendly by improving semantics, labels, alt text, and ARIA usage, plus safe focus handling only where it does NOT change behavior. You must not add new capabilities, new user flows, new features, new components, new services, new helpers, or new functions. Do not refactor. Do not change any existing behavior. Do not change business logic. Do not change routing. Do not change API calls. Do not add new UI elements that alter meaning or interaction.

SCOPE (what you MAY change)
Only modify markup and existing attributes in templates (HTML) and, if already present, CSS classes for focus visibility (no layout shifts, no new UI behavior).
Allowed changes include:

- Add or correct: alt, aria-label, aria-labelledby, aria-describedby, aria-hidden, role, tabindex (ONLY when necessary), name/id/for associations, autocomplete, inputmode.
- Replace non-semantic clickable elements with semantic equivalents ONLY if it does not change behavior (example: <div (click)> to <button type="button"> with identical handlers and styling preserved). If you are not 100% sure it won’t change behavior, do NOT do it.
- Add missing <label> elements or connect existing visible text to controls via for/id or aria-labelledby.
- Ensure icons are either accessible (with text alternative) or explicitly decorative (aria-hidden="true" and focusable="false" for SVG).
- Ensure images have correct alt text or empty alt="" when decorative.
- Ensure form errors and hints are programmatically associated (aria-describedby) using EXISTING text in the DOM; do not add new messages.
- Ensure dialogs/menus/tabs accordions have correct roles and ARIA attributes only if those patterns already exist; do not create new behavior.

SCOPE (what you must NOT do)

- Do not add new TS logic, new functions, new event handlers, new directives, new libraries, or new dependencies.
- Do not introduce or change keyboard interactions beyond what the browser already provides for native elements.
- Do not add focus traps or complex focus management. Only fix obvious focus issues by ensuring focusable controls are real controls and that hidden elements are not focusable.
- Do not add new text content that changes meaning. You may reuse existing text for labeling (aria-labelledby) or add invisible labels ONLY if they already exist in the codebase as a utility class (e.g., sr-only). If no such class exists, don’t add one.

ACCESSIBILITY STANDARDS
Target: WCAG 2.2 AA and ARIA Authoring Practices (use ARIA only when needed).
Follow these rules:

1. Prefer native HTML semantics over ARIA. “No ARIA is better than bad ARIA.”
2. Every interactive control must have an accessible name:
   - Use visible <label> first.
   - Else use aria-labelledby referencing existing visible text.
   - Else use aria-label as a last resort.
3. Never add redundant roles to native elements (e.g., role="button" on <button>).
4. Decorative icons/images must be hidden from assistive tech:
   - <img alt=""> when decorative
   - SVG: aria-hidden="true" focusable="false"
5. Inputs must have:
   - Explicit <label for=id> OR aria-labelledby
   - Correct type, autocomplete where appropriate
   - aria-invalid when invalid state is already present
   - aria-describedby tying to existing hint/error text nodes
6. Buttons/links:
   - Use <button type="button"> for actions, <a href> for navigation (do not change navigation).
   - Ensure icon-only buttons have aria-label.
7. Headings/landmarks:
   - Ensure a logical heading hierarchy (h1 then h2 etc) only if the headings already exist; do not rewrite content.
   - Ensure main landmarks exist (<main>, <header>, <nav>, <footer>) if already structurally present; do not restructure layout aggressively.
8. Tables:
   - Use <th scope="col/row"> where appropriate if tables exist.
9. Lists:
   - Use <ul>/<ol> for real lists if already lists; do not change visuals/behavior.
10. Focus:

- Ensure visible focus indicator is not removed. If CSS removes outlines, restore them using existing classes/selectors without changing layout.
- Remove tabindex="0" from non-interactive elements unless absolutely necessary.
- Ensure aria-hidden content is not focusable (remove tabindex if present).

ANGULAR-SPECIFIC RULES

- Respect Angular bindings. Do not break *ngIf, *ngFor, [attr._], [class._], (click), routerLink, formControlName, ngModel.
- When adding ARIA attributes, prefer Angular-safe syntax:
  - [attr.aria-label]="..." when bound
  - aria-label="..." when static
- For Material/third-party components:
  - Use the component’s supported input properties for labels (e.g., matInput placeholder is not a label; prefer <mat-label> or aria-label where label is missing).
  - Do not alter component logic.

DELIVERABLE FORMAT
Work in small, safe diffs.
For each file you touch, output:

1. File path
2. A short list of EXACT changes made (bullets)
3. A patch-style diff (or clearly separated BEFORE/AFTER snippets) focusing only on the changed lines
4. A short “Accessibility rationale” mapping to WCAG / ARIA best practice

WORKFLOW

1. Scan the repo for templates: \*.component.html, shared components, layout, navigation, modals, forms, buttons, icons, images.
2. Identify and fix, in this priority order:
   P0: unlabeled inputs, icon-only buttons, missing alt, clickable non-controls, keyboard focus issues from tabindex/outline removal, dialogs without accessible name.
   P1: error message association, headings/landmarks, table headers.
   P2: redundant/incorrect ARIA, decorative icons exposure, duplicate IDs.
3. Keep every change minimal and behavior-preserving.
4. If something would require new code/logic to fix properly, DO NOT implement it. Instead, leave a “Needs code change (out of scope)” note with the file and line and what the ideal fix would be.

QUALITY BAR / ACCEPTANCE CHECKLIST

- No interactive element is unnamed.
- No placeholder-only labels.
- Decorative imagery is not announced.
- ARIA is valid, not contradictory.
- No new TS functions or behavior changes.
- No keyboard traps introduced.
- Focus styles remain visible.
```
