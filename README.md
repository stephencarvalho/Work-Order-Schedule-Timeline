# Work Order Schedule Timeline

## Run the App (Step-by-Step)

Follow these steps in order.

1. Install Node.js

- Use Node.js `20.19+` (Angular CLI 21 requires at least `20.19`, or `22.12+`).
- Check your version:

```bash
node -v
```

2. Open this project folder in a terminal

```bash
cd /Users/stephencarvalho/Documents/GitHub/Work-Order-Schedule-Timeline
```

3. Install project dependencies

```bash
npm install
```

4. Install Playwright browser (needed for E2E tests)

```bash
npx playwright install
```

5. Start the app (`ng serve` via npm script)

```bash
npm run start
```

6. Open the app in your browser

- Go to: `http://localhost:4200`

If the page does not open:

- Make sure step 5 is still running.
- Make sure nothing else is using port `4200`.

## Run Tests and Coverage Reports (Step-by-Step)

### Unit Tests (Jasmine/Karma)

1. Run unit tests with coverage

```bash
npm run test:coverage
```

2. Open the unit coverage report in a browser (macOS)

```bash
open coverage/work-order-schedule-timeline/index.html
```

### E2E Tests (Playwright)

1. Run E2E tests

```bash
npm run test:e2e
```

### E2E Coverage Report (Playwright + V8 -> Istanbul)

1. Run E2E tests with coverage instrumentation and generate the report

```bash
npm run test:e2e:coverage
```

2. Open the E2E coverage report in a browser (macOS)

```bash
open coverage/e2e/index.html
```

### Run All Automation (Unit + E2E)

```bash
npm run test:automation
```

## App Description

An interactive Angular application for scheduling manufacturing work orders across many work centers on a timeline. Users can view the schedule in `Day`, `Week`, and `Month` timescales, create/update/delete work orders, and receive clear feedback when actions succeed or fail.

## Key Features

- Create work orders from the timeline (click an empty slot) or from the top `Create` button.
- Update work orders from the contextual popover actions.
- Delete work orders from the contextual popover actions.
- Switch timeline timescales between `Day`, `Week`, and `Month`.
- Change visible timeline context using `Year` and `Month` dropdowns.
- Alert messages / notifications for user feedback so users know what happened after actions (Created, Updated, Deleted, Overlap, etc.).
- Validation for required fields, date range ordering, and overlapping work orders in the same work center.
- Local persistence using `localStorage`.
- Easter Egg: Fireworks animation when a work order is marked `Complete`.

## Approach (Brief)

- Use a standalone Angular component architecture with a store service for data state (`WorkOrderStoreService`).
- Keep date calculations and timeline projection logic in utilities for easier testing and maintenance.
- Use a slide-out panel with Reactive Forms for create/edit flows.
- Use Playwright for user-journey E2E tests and Jasmine/Karma for unit tests and utility/service coverage.

## Libraries Used and Why

- `@angular/*` (Angular 21): app framework, signals, standalone components, forms, routing.
- `@ng-select/ng-select`: compact, user-friendly dropdowns for timescale/year/month/status selectors.
- `@ng-bootstrap/ng-bootstrap`: datepicker and UI helpers integrated with Angular.
- `bootstrap`: required base styles for `ng-bootstrap` components and utility styling support.
- `canvas-confetti`: lightweight celebratory effect for completed work orders.
- `@playwright/test`: E2E automation.
- `karma`, `jasmine`, `karma-coverage`: unit test execution and coverage reporting.
- `v8-to-istanbul`, `istanbul-*`: convert Playwright JS coverage to Istanbul reports for E2E coverage output.

## Project Structure (High Level)

- `src/app/components/work-order-timeline/`
  - Timeline rendering, interactions, popovers, notifications, create/edit orchestration.
- `src/app/components/work-order-panel/`
  - Slide-out create/edit panel, Reactive Form, datepicker integration.
- `src/app/services/work-order-store.service.ts`
  - Work order CRUD, overlap validation, `localStorage` persistence/versioning.
- `src/app/utils/date-utils.ts`
  - Complex date calculations (week/month boundaries, date diffs, formatting).
- `src/app/components/work-order-timeline/work-order-timeline.utils.ts`
  - Timeline projection, date-to-pixel mapping, card placement, hover slot resolution.
- `e2e/`
  - Playwright tests and fixtures.

## Key Decisions and Trade-offs

### 1. Year + Month Dropdowns Instead of an Infinite Scrolling Timeline

We intentionally chose `Year` and `Month` dropdowns (plus timescale selection) instead of an infinite timeline scroll.

Why:

- Keeps the user grounded in a clear time context (especially important for production scheduling).
- Reduces accidental long-distance scrolling mistakes.
- Makes it faster to jump to a known month/year than dragging through a very large timeline.
- Prevents context overload when many work centers and work orders are already visible.
- Simplifies performance and rendering behavior (bounded timeline window instead of unbounded virtual time).
- Makes testing and reproducibility easier (selected year/month is explicit UI state).

Trade-off:

- Infinite scroll can feel more fluid for exploratory browsing.
- We accept that trade-off because scheduling tasks usually start from a known planning window.

### 2. Condensed Work Order Content in Narrow Timeline Bars

We intentionally avoid forcing all inline content into very narrow work-order bars.

Why:

- Dense timeline views (especially Day/Week or short durations) can make bars too small for readable text.
- Overstuffed labels create overlap, visual noise, and ambiguous click targets.
- It is better to show a clean bar and reveal full details on demand than to render unreadable text.

Current behavior / design direction:

- The UI conditionally hides secondary inline info (such as the status badge) when width is insufficient.
- The work-order card remains clickable and the popover shows full details and actions.
- This same principle can be extended further (for example, suppressing the inline name entirely on ultra-narrow widths) if needed.

Trade-off:

- Less information is visible at a glance for narrow cards.
- In return, readability and click reliability improve significantly.

### 3. Popover Actions Instead of a Tiny Three-Dots Context Menu Trigger

We chose popover-based contextual actions for edit/delete on the work-order card (instead of relying on a tiny three-dots icon in a cramped bar).

Why:

- Work-order bars can be small; a tiny menu icon is harder to see and click reliably.
- Clicking the card itself is a larger, more discoverable target.
- The popover can show both actions and useful metadata (status + dates) in one place.
- Reduces inline visual clutter on a dense timeline.

Trade-off:

- Users need one extra click to see actions/details.
- We accept this to keep the timeline clean and legible.

### 4. Top-Level `Create` Button in Addition to In-Row Creation

We added a top `Create` button even though users can also create by clicking an empty timeline slot.

Why:

- When there are many work centers, users may struggle to find the correct row first.
- The top-level action provides a fast starting point for creating a work order.
- It reduces friction on smaller screens or crowded views.
- It improves discoverability for new users who may not realize empty slots are clickable.
- It supports workflows where the user knows they need to create something before deciding exact placement.

Trade-off:

- Another button adds minor toolbar complexity.
- The usability improvement is worth it, especially at larger scale.

## User Feedback and Alerts (Why It Matters)

We intentionally show clear alerts/notifications after key actions.

Why:

- Users need confirmation that create/update/delete actions actually happened.
- Overlap validation and other blocked actions should explain why the action did not proceed.
- Positive feedback improves confidence and reduces repeated clicks.

Examples:

- `Created`
- `Updated`
- `Deleted`
- `Schedule Overlap` (warning)
- `All Done` + fireworks for completed work orders

## Easter Egg: Fireworks on Completion

When a work order is saved with status `Complete`, the app triggers a confetti/fireworks celebration.

Why:

- Reinforces the completion event with a memorable interaction.
- Adds delight without affecting core scheduling functionality.

Trade-off:

- Extra animation complexity and timing cleanup logic.
- This is isolated so it does not block normal CRUD behavior.

## Code Comments for Complex Logic and Key Decisions

The codebase includes comments around:

- Complex date calculations and timeline math (date utilities and timeline projection helpers)
- Overlap validation logic (inclusive date intersection checks)
- Persistence/versioning behavior for `localStorage`
- UI behavior decisions where additional context helps future maintainers

Relevant files:

- `src/app/utils/date-utils.ts`
- `src/app/components/work-order-timeline/work-order-timeline.utils.ts`
- `src/app/services/work-order-store.service.ts`

## Upgrades / Future Enhancements
1. Filters for work centers and work orders

- Allow users to filter visible work centers and work orders to reduce visual overload and focus on relevant data.

2. Global search

- Add a global search for work centers and work orders to improve findability in larger datasets.

## Setup Notes / Troubleshooting

- Angular CLI 21 requires Node `20.19+` (or `22.12+`). If you see a Node version error, upgrade Node first.
- If Playwright tests fail on first run, make sure `npx playwright install` was executed.
- If `4200` is busy, stop the other process or run Angular on a different port and update Playwright `baseURL` if needed.

## Trade-offs Summary (Quick Version)

- Bounded time navigation (`Year`/`Month`) over infinite scroll: better scheduling context and less user error.
- Clean bars + on-demand details over always-visible inline metadata: better readability in dense timelines.
- Popover contextual actions over tiny inline menu trigger: better clickability and reduced clutter.
- Dual create entry points (row-click + toolbar button): better discoverability and faster workflows at scale.
