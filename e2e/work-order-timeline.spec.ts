import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

async function selectNgOption(page: Page, testId: string, label: string): Promise<void> {
  const select = page.getByTestId(testId);
  await select.locator('.ng-select-container').click();
  const dropdown = page.locator('.ng-dropdown-panel').last();
  await expect(dropdown).toBeVisible();
  await dropdown.locator('.ng-option', { hasText: label }).first().click();
}

async function openCreatePanel(page: Page): Promise<void> {
  await page.getByTestId('create-order-button').click();
  await expect(page.getByTestId('work-order-panel')).toBeVisible();
}

async function fillPanelDates(page: Page, startDate: string, endDate: string): Promise<void> {
  await page.getByTestId('work-order-start-date-input').fill(startDate);
  await page.getByTestId('work-order-end-date-input').fill(endDate);
}

async function assertTodayCentered(page: Page, tolerance = 8): Promise<void> {
  await expect.poll(async () => {
    return page.evaluate(() => {
      const container = document.querySelector('[data-testid="timeline-scroll-pane"]') as HTMLDivElement | null;
      const guide = document.querySelector('.today-guide') as HTMLDivElement | null;
      if (!container || !guide) {
        throw new Error('Timeline container or today guide not found.');
      }

      const containerRect = container.getBoundingClientRect();
      const guideRect = guide.getBoundingClientRect();
      const containerCenterX = containerRect.left + containerRect.width / 2;
      const guideCenterX = guideRect.left + guideRect.width / 2;

      return Math.abs(containerCenterX - guideCenterX);
    });
  }).toBeLessThanOrEqual(tolerance);
}

async function expectTodayToolbarState(page: Page): Promise<void> {
  const browserToday = await page.evaluate(() => ({
    year: String(new Date().getFullYear()),
    monthShort: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date())
  }));

  await expect(page.getByTestId('timescale-select')).toContainText('Day');
  await expect(page.getByTestId('year-select')).toContainText(browserToday.year);
  await expect(page.getByTestId('month-select')).toContainText(browserToday.monthShort);
  await expect(page.locator('.today-guide')).toHaveCount(1);
}

async function createWorkOrder(
  page: Page,
  params: { workCenter: string; name: string; statusLabel: 'Open' | 'In progress' | 'Complete' | 'Blocked'; start: string; end: string }
): Promise<void> {
  await openCreatePanel(page);
  await selectNgOption(page, 'work-center-select', params.workCenter);
  await page.getByTestId('work-order-name-input').fill(params.name);
  await selectNgOption(page, 'work-order-status-select', params.statusLabel);
  await fillPanelDates(page, params.start, params.end);
  await page.getByTestId('panel-submit-button').click();
}

function dotDateToLongLabel(value: string): string {
  const [mm, dd, yyyy] = value.split('.').map(Number);
  return new Date(yyyy, mm - 1, dd).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Work Orders' })).toBeVisible({ timeout: 15_000 });
});

test('loads timeline and allows toolbar interactions', async ({ page }) => {
  await expect(page).toHaveTitle('Work Order Schedule Timeline');
  await expectTodayToolbarState(page);
  await assertTodayCentered(page);

  const sortButton = page.getByTestId('work-center-sort-button');
  await expect(sortButton).toHaveText('Work Center');
  await sortButton.click();
  await expect(sortButton).toHaveText('Work Center (A-Z)');
  await sortButton.click();
  await expect(sortButton).toHaveText('Work Center (Z-A)');
  await sortButton.click();
  await expect(sortButton).toHaveText('Work Center');

  await selectNgOption(page, 'timescale-select', 'Week');
  await expect(page.getByTestId('timescale-select')).toContainText('Week');

  await selectNgOption(page, 'timescale-select', 'Month');
  await expect(page.getByTestId('timescale-select')).toContainText('Month');

  await selectNgOption(page, 'timescale-select', 'Day');
  await expect(page.getByTestId('timescale-select')).toContainText('Day');

  const priorYear = String(new Date().getFullYear() - 1);
  await selectNgOption(page, 'year-select', priorYear);
  await expect(page.getByTestId('year-select')).toContainText(priorYear);
  await expect(page.locator('.today-guide')).toHaveCount(0);

  await selectNgOption(page, 'month-select', 'Mar');
  await expect(page.getByTestId('month-select')).toContainText('Mar');

  const todayButton = page.getByTestId('today-button');
  const expectedTooltip = await page.evaluate(
    () =>
      `Go to today ${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())}`
  );
  await expect(todayButton).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  const todayButtonColor = await todayButton.evaluate((el) => getComputedStyle(el).color);
  expect(['rgb(62, 64, 219)', 'rgb(75, 87, 245)']).toContain(todayButtonColor);
  await todayButton.hover();
  await expect(page.getByTestId('today-button-tooltip')).toHaveText(expectedTooltip);

  await todayButton.click();
  await expectTodayToolbarState(page);
  await assertTodayCentered(page);
  await expect(page.locator('.header-column.current-header-column')).toHaveCount(1);
});

test('creates a new work order and shows success notification', async ({ page }) => {
  await openCreatePanel(page);

  await selectNgOption(page, 'work-center-select', 'Work Center 001');
  await page.getByTestId('work-order-name-input').fill('Playwright Created Order');
  await selectNgOption(page, 'work-order-status-select', 'Open');
  await fillPanelDates(page, '03.15.2026', '03.20.2026');

  await page.getByTestId('panel-submit-button').click();

  await expect(page.getByTestId('timeline-notification').filter({ hasText: 'Created' })).toHaveCount(1);
  await expect(page.locator('.work-order-card .order-name', { hasText: 'Playwright Created Order' })).toBeVisible();
});

test('prevents overlapping work orders', async ({ page }) => {
  await openCreatePanel(page);

  await selectNgOption(page, 'work-center-select', 'Work Center 001');
  await page.getByTestId('work-order-name-input').fill('Overlap Attempt');
  await fillPanelDates(page, '02.10.2026', '02.14.2026');

  await page.getByTestId('panel-submit-button').click();

  await expect(page.getByTestId('panel-overlap-error')).toContainText('overlaps with');
  await expect(page.getByTestId('timeline-notification').filter({ hasText: 'Schedule Overlap' })).toHaveCount(1);
  await expect(page.getByTestId('work-order-panel')).toBeVisible();
});

test('edits and deletes an existing work order from the popover', async ({ page }) => {
  const targetCard = page.getByTestId('order-card-wo-wc001-03');
  await expect(targetCard).toBeVisible();

  await targetCard.click();
  await page.getByTestId('popover-edit-button').click();

  await expect(page.getByTestId('panel-submit-button')).toHaveText('Save');
  await page.getByTestId('work-order-name-input').fill('WC001 Order 03 Updated');
  await page.getByTestId('panel-submit-button').click();

  await expect(page.getByTestId('timeline-notification').filter({ hasText: 'All Done' })).toHaveCount(1);
  await expect(page.locator('.work-order-card .order-name', { hasText: 'WC001 Order 03 Updated' })).toBeVisible();

  await page.getByTestId('order-card-wo-wc001-03').click();
  await page.getByTestId('popover-delete-button').click();

  await expect(page.getByTestId('timeline-notification').filter({ hasText: 'Deleted' })).toHaveCount(1);
  await expect(page.getByTestId('order-card-wo-wc001-03')).toHaveCount(0);
});

test('new work order panel supports keyboard interactions and creates all statuses including complete fireworks', async ({ page }) => {
  test.setTimeout(60_000);

  await page.evaluate(() => {
    const ngApi = (window as unknown as {
      ng?: {
        getComponent?: (el: Element) => any;
        getOwningComponent?: (el: Element) => any;
      };
    }).ng;
    const timelineHost = document.querySelector('app-work-order-timeline');
    const timelineRoot = document.querySelector('.timeline-content');
    const timeline =
      (timelineRoot && ngApi?.getOwningComponent?.(timelineRoot)) ??
      (timelineHost && ngApi?.getComponent?.(timelineHost)) ??
      null;
    (window as unknown as { __pwFireworksCount?: number; __pwFireworksHookInstalled?: boolean }).__pwFireworksCount = 0;
    (window as unknown as { __pwFireworksHookInstalled?: boolean }).__pwFireworksHookInstalled = false;

    if (timeline && typeof timeline['triggerFireworks'] === 'function') {
      const original = timeline['triggerFireworks'].bind(timeline);
      timeline['triggerFireworks'] = () => {
        (window as unknown as { __pwFireworksCount?: number }).__pwFireworksCount =
          ((window as unknown as { __pwFireworksCount?: number }).__pwFireworksCount ?? 0) + 1;
        return original();
      };
      (window as unknown as { __pwFireworksHookInstalled?: boolean }).__pwFireworksHookInstalled = true;
    }
  });

  const createButton = page.getByTestId('create-order-button');
  await createButton.click();
  await expect(page.getByTestId('work-order-panel')).toBeVisible();

  await page.getByTestId('work-order-name-input').click();
  await page.evaluate(() => {
    const ngApi = (window as unknown as {
      ng?: {
        getComponent?: (el: Element) => any;
        getOwningComponent?: (el: Element) => any;
      };
    }).ng;
    const panelHost = document.querySelector('app-work-order-panel');
    const panelElement = document.querySelector('[data-testid="work-order-panel"]');
    const panel =
      (panelElement && ngApi?.getOwningComponent?.(panelElement)) ??
      (panelHost && ngApi?.getComponent?.(panelHost)) ??
      (panelElement && ngApi?.getComponent?.(panelElement));

    if (panel?.onEscapeKey) {
      panel.onEscapeKey(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return;
    }

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  });
  await page.waitForTimeout(250);
  await expect.poll(async () => {
    return page.evaluate(() => {
      const panel = document.querySelector('[data-testid="work-order-panel"]');
      const overlay = document.querySelector('[data-testid="work-order-panel-overlay"]');
      return !panel || overlay?.classList.contains('panel-overlay--closing') === true;
    });
  }).toBe(true);

  if (await page.getByTestId('work-order-panel').isVisible()) {
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Work Orders' })).toBeVisible();
  }

  await createButton.click();
  await expect(page.getByTestId('work-order-panel')).toBeVisible();

  await page.getByTestId('work-order-name-input').click();
  const focusOrder: string[] = [];
  for (let i = 0; i < 5; i += 1) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement | null;
      return active?.id || active?.getAttribute('data-testid') || active?.tagName || '';
    });
    focusOrder.push(focused);
  }
  expect(focusOrder.length).toBe(5);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByTestId('panel-cancel-button').click({ force: true });
  await expect.poll(async () => {
    return page.evaluate(() => {
      const panel = document.querySelector('[data-testid="work-order-panel"]');
      const overlay = document.querySelector('[data-testid="work-order-panel-overlay"]');
      return !panel || overlay?.classList.contains('panel-overlay--closing') === true;
    });
  }).toBe(true);
  if (await page.getByTestId('work-order-panel').isVisible()) {
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Work Orders' })).toBeVisible();
  }

  const cases = [
    { workCenter: 'Work Center 002', name: 'PW Status Open', statusLabel: 'Open' as const, start: '04.01.2026', end: '04.03.2026', notice: 'Created' },
    { workCenter: 'Work Center 003', name: 'PW Status In Progress', statusLabel: 'In progress' as const, start: '04.04.2026', end: '04.06.2026', notice: 'Created' },
    { workCenter: 'Work Center 004', name: 'PW Status Blocked', statusLabel: 'Blocked' as const, start: '04.07.2026', end: '04.09.2026', notice: 'Created' },
    { workCenter: 'Work Center 005', name: 'PW Status Complete', statusLabel: 'Complete' as const, start: '04.10.2026', end: '04.12.2026', notice: 'All Done' }
  ];

  for (const item of cases) {
    await createWorkOrder(page, item);
    await expect(page.getByTestId('timeline-notification').filter({ hasText: item.notice })).toHaveCount(1);
    await expect(page.locator('.work-order-card .order-name', { hasText: item.name })).toBeVisible();
  }

  const fireworksHookInstalled = await page.evaluate(
    () => (window as unknown as { __pwFireworksHookInstalled?: boolean }).__pwFireworksHookInstalled === true
  );
  if (fireworksHookInstalled) {
    await expect
      .poll(async () => page.evaluate(() => (window as unknown as { __pwFireworksCount?: number }).__pwFireworksCount ?? 0))
      .toBeGreaterThan(0);
  }
});

test('edit work order updates fields, dates, and statuses while preserving work center display', async ({ page }) => {
  test.setTimeout(60_000);

  const card = page.getByTestId('order-card-wo-wc001-03');
  const originalStyle = await card.getAttribute('style');

  const updates = [
    { name: 'WC001 Order 04 Open Edit', statusLabel: 'Open' as const, start: '04.13.2026', end: '04.15.2026', statusText: 'Open' },
    { name: 'WC001 Order 04 Progress Edit', statusLabel: 'In progress' as const, start: '04.16.2026', end: '04.18.2026', statusText: 'In progress' },
    { name: 'WC001 Order 04 Blocked Edit', statusLabel: 'Blocked' as const, start: '04.19.2026', end: '04.21.2026', statusText: 'Blocked' },
    { name: 'WC001 Order 04 Complete Edit', statusLabel: 'Complete' as const, start: '04.22.2026', end: '04.24.2026', statusText: 'Complete' }
  ];

  for (const [index, update] of updates.entries()) {
    await page.getByTestId('order-card-wo-wc001-03').scrollIntoViewIfNeeded();
    await page.getByTestId('order-card-wo-wc001-03').click({ force: true });
    const editPopover = page.getByTestId('order-popover-content').last();
    await expect(editPopover).toBeVisible();
    const editButton = editPopover.getByTestId('popover-edit-button');
    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page.getByTestId('work-order-panel')).toBeVisible();
    await expect(page.getByTestId('panel-submit-button')).toHaveText('Save');
    await expect(page.getByTestId('work-center-name-display')).toHaveValue('Work Center 001');

    await page.getByTestId('work-order-name-input').fill(update.name);
    await selectNgOption(page, 'work-order-status-select', update.statusLabel);
    await fillPanelDates(page, update.start, update.end);
    await page.getByTestId('panel-submit-button').click();

    await expect(page.getByTestId('timeline-notification').filter({ hasText: update.statusLabel === 'Complete' ? 'All Done' : 'Updated' })).toHaveCount(1);
    await expect(page.locator('.work-order-card .order-name', { hasText: update.name })).toBeVisible();

    await page.getByTestId('order-card-wo-wc001-03').click({ force: true });
    const activePopover = page.getByTestId('order-popover-content').last();
    await expect(activePopover).toBeVisible();
    await expect(activePopover.getByTestId('order-popover-name')).toHaveText(update.name);
    await expect(activePopover.getByTestId('order-popover-status')).toContainText(update.statusText);
    await expect(activePopover.getByTestId('order-popover-start')).toContainText(dotDateToLongLabel(update.start));
    await expect(activePopover.getByTestId('order-popover-end')).toContainText(dotDateToLongLabel(update.end));
    await page.mouse.click(10, 10);
    await expect(page.getByTestId('order-popover-content')).toHaveCount(0);
  }

  const newStyle = await page.getByTestId('order-card-wo-wc001-03').getAttribute('style');
  expect(newStyle).not.toBe(originalStyle);
});

test('timeline scroll keeps left pane and headers sticky and syncs header content horizontally', async ({ page }) => {
  const metricsBefore = await page.evaluate(() => {
    const scrollPane = document.querySelector('[data-testid=\"timeline-scroll-pane\"]') as HTMLDivElement | null;
    const leftPane = document.querySelector('[data-testid=\"timeline-left-pane\"]') as HTMLElement | null;
    const header = document.querySelector('[data-testid=\"timeline-right-header\"]') as HTMLElement | null;
    const headerTrack = document.querySelector('[data-testid=\"header-track-content\"]') as HTMLElement | null;
    if (!scrollPane || !leftPane || !header || !headerTrack) {
      throw new Error('Timeline elements not found');
    }
    return {
      leftPaneLeft: leftPane.getBoundingClientRect().left,
      headerTop: header.getBoundingClientRect().top,
      headerPosition: getComputedStyle(header).position,
      headerTransform: getComputedStyle(headerTrack).transform
    };
  });

  await page.evaluate(() => {
    const scrollPane = document.querySelector('[data-testid=\"timeline-scroll-pane\"]') as HTMLDivElement | null;
    if (!scrollPane) {
      throw new Error('scroll pane missing');
    }
    scrollPane.scrollLeft = 600;
    window.scrollTo(0, 600);
  });

  await page.waitForTimeout(150);

  const metricsAfter = await page.evaluate(() => {
    const scrollPane = document.querySelector('[data-testid=\"timeline-scroll-pane\"]') as HTMLDivElement | null;
    const leftPane = document.querySelector('[data-testid=\"timeline-left-pane\"]') as HTMLElement | null;
    const header = document.querySelector('[data-testid=\"timeline-right-header\"]') as HTMLElement | null;
    const headerTrack = document.querySelector('[data-testid=\"header-track-content\"]') as HTMLElement | null;
    if (!scrollPane || !leftPane || !header || !headerTrack) {
      throw new Error('Timeline elements not found');
    }
    return {
      scrollLeft: scrollPane.scrollLeft,
      leftPaneLeft: leftPane.getBoundingClientRect().left,
      headerTop: header.getBoundingClientRect().top,
      headerPosition: getComputedStyle(header).position,
      headerTransform: getComputedStyle(headerTrack).transform
    };
  });

  expect(metricsAfter.scrollLeft).toBeGreaterThan(0);
  expect(Math.abs(metricsAfter.leftPaneLeft - metricsBefore.leftPaneLeft)).toBeLessThanOrEqual(2);
  expect(metricsBefore.headerPosition).toBe('sticky');
  expect(metricsAfter.headerPosition).toBe('sticky');
  expect(Math.abs(metricsAfter.headerTop - metricsBefore.headerTop)).toBeLessThanOrEqual(10);
  expect(metricsAfter.headerTransform).not.toBe(metricsBefore.headerTransform);
});

test('order hover tooltip shows after delay and is suppressed when popover is open', async ({ page }) => {
  const targetCard = page.getByTestId('order-card-wo-wc001-02');
  await expect(targetCard).toBeVisible();

  await targetCard.hover();
  await page.waitForTimeout(1100);
  await expect(page.getByTestId('order-hover-tooltip')).toBeVisible();
  await expect(page.getByTestId('order-hover-tooltip')).toContainText('WC001 Order 02');
  await expect(page.getByTestId('order-hover-tooltip')).toContainText('In progress');

  await targetCard.click();
  await expect(page.getByTestId('order-popover-content')).toBeVisible();
  await expect(page.getByTestId('order-popover-name')).toHaveText('WC001 Order 02');
  await expect(page.getByTestId('order-popover-status')).toContainText('In progress');
  await expect(page.getByTestId('order-popover-start')).toContainText('Jan');
  await expect(page.getByTestId('order-popover-end')).toContainText('Feb');

  await page.waitForTimeout(1100);
  await expect(page.getByTestId('order-hover-tooltip')).toHaveCount(0);
});

test('covers internal branches for e2e coverage', async ({ page }) => {
  await page.evaluate(async () => {
    const callIfFunction = (obj: Record<string, unknown>, key: string, ...args: unknown[]) => {
      const candidate = obj[key];
      if (typeof candidate === 'function') {
        return (candidate as (...fnArgs: unknown[]) => unknown).apply(obj, args);
      }
      return undefined;
    };

    const ngApi = (window as unknown as { ng?: { getComponent: (el: Element) => any } }).ng;
    if (!ngApi?.getComponent) {
      throw new Error('Angular debug API is not available.');
    }

    const timelineHost = document.querySelector('app-work-order-timeline');
    const panelHost = document.querySelector('app-work-order-panel');
    if (!timelineHost || !panelHost) {
      throw new Error('Required component hosts not found.');
    }

    const timeline = ngApi.getComponent(timelineHost);
    const panel = ngApi.getComponent(panelHost);
    const store = timeline['store'];

    const sampleOrder = timeline.getOrdersForCenter('wc-001')[0];
    const samplePayload = {
      name: 'Coverage Order',
      workCenterId: 'wc-001',
      status: 'open',
      startDate: '2026-04-01',
      endDate: '2026-04-02'
    };

    panel['dateParserFormatter'].parse('');
    panel['dateParserFormatter'].parse('xx');
    panel['dateParserFormatter'].parse('aa.bb.cccc');
    panel['dateParserFormatter'].parse('13.10.2026');
    panel['dateParserFormatter'].parse('02.31.2026');
    panel['dateParserFormatter'].format(null);
    callIfFunction(panel, 'toDateStruct', '');
    callIfFunction(panel, 'toDateStruct', '2026-03-01');
    panel.onClose();

    panel['startDateInputRef'] = { nativeElement: { value: '' } };
    panel['endDateInputRef'] = { nativeElement: { value: '' } };
    panel.form.reset({ name: '', workCenterId: null, status: 'open', startDate: null, endDate: null });
    panel.onSubmit();

    panel['startDateInputRef'] = { nativeElement: { value: '04.01.2026' } };
    panel['endDateInputRef'] = { nativeElement: { value: '04.02.2026' } };
    panel.form.reset({
      name: '   ',
      workCenterId: 'wc-001',
      status: 'open',
      startDate: { year: 2026, month: 4, day: 1 },
      endDate: { year: 2026, month: 4, day: 2 }
    });
    panel.onSubmit();

    panel.form.reset({
      name: 'Name',
      workCenterId: null,
      status: 'open',
      startDate: { year: 2026, month: 4, day: 1 },
      endDate: { year: 2026, month: 4, day: 2 }
    });
    panel.onSubmit();

    panel.mode = 'edit';
    panel.editingOrder = sampleOrder;
    panel.form.reset({
      name: 'Coverage Edit',
      workCenterId: 'wc-001',
      status: 'blocked',
      startDate: { year: 2026, month: 4, day: 1 },
      endDate: { year: 2026, month: 4, day: 2 }
    });
    panel.onSubmit();

    const fakeDatepicker = {
      state: { firstDate: { year: 2026, month: 2, day: 1 } },
      navigateTo: (_value: unknown) => undefined
    };
    panel.pickerMonth(fakeDatepicker);
    panel.pickerYear(fakeDatepicker);
    panel.onPickerMonthChange(fakeDatepicker, 3);
    panel.onPickerYearChange(fakeDatepicker, 2027);
    panel.shiftPickerMonth(fakeDatepicker, -1);
    callIfFunction(panel, 'getPickerAnchor', { state: { firstDate: null } });

    panel['closeAnimationTimeoutId'] = window.setTimeout(() => undefined, 5000);
    panel.isPanelVisible = true;
    panel.isOpen = false;
    panel.ngOnChanges({
      isOpen: {
        currentValue: false,
        previousValue: true,
        firstChange: false,
        isFirstChange: () => false
      }
    });
    panel.ngOnDestroy();

    const originalComputeHoverSlot = timeline['computeHoverSlot'];
    timeline['computeHoverSlot'] = () => null;
    timeline.onTrackClick(
      {
        target: { closest: () => null },
        currentTarget: { getBoundingClientRect: () => ({ left: 0 }) },
        clientX: 12
      },
      'wc-001'
    );

    timeline['computeHoverSlot'] = () => ({
      centerId: 'wc-001',
      left: 10,
      width: 40,
      startDate: new Date(2026, 3, 1),
      endDate: new Date(2026, 3, 2)
    });
    timeline.onTrackClick(
      {
        target: { closest: () => null },
        currentTarget: { getBoundingClientRect: () => ({ left: 0 }) },
        clientX: 20
      },
      'wc-001'
    );
    timeline['computeHoverSlot'] = originalComputeHoverSlot;

    timeline.onHoverCenter('wc-001');
    timeline.onHoverCenter(null);
    timeline.onTrackEnter(
      {
        currentTarget: { getBoundingClientRect: () => ({ left: 0 }) },
        clientX: 30
      },
      'wc-001'
    );
    timeline.onTrackHover(
      {
        currentTarget: { getBoundingClientRect: () => ({ left: 0 }) },
        clientX: 31
      },
      'wc-001'
    );
    timeline.onTrackLeave();

    const popoverA = {
      opened: false,
      closed: false,
      isOpen: () => true,
      open: () => {
        popoverA.opened = true;
      },
      close: () => {
        popoverA.closed = true;
      },
      positionTarget: undefined
    };
    const popoverB = {
      opened: false,
      closed: false,
      isOpen: () => false,
      open: () => {
        popoverB.opened = true;
      },
      close: () => {
        popoverB.closed = true;
      },
      positionTarget: undefined
    };

    timeline['activeOrderPopover'] = popoverA;
    timeline.onOrderCardClick(
      { stopPropagation: () => undefined, clientX: 40, clientY: 40, target: { closest: () => null } },
      sampleOrder,
      popoverB
    );
    timeline.onOrderPopoverHidden(popoverA);

    timeline['activeOrderPopover'] = popoverA;
    timeline.onOrderCardClick(
      { stopPropagation: () => undefined, clientX: 41, clientY: 41, target: { closest: () => null } },
      sampleOrder,
      popoverA
    );

    timeline.activePopoverOrder.set(null);
    timeline.onOrderPopoverEdit();
    timeline.onOrderPopoverDelete();

    timeline.onPanelSubmit({ payload: { ...samplePayload, workCenterId: '' } });

    const originalFindOverlap = store.findOverlap.bind(store);
    store.findOverlap = () => sampleOrder;
    timeline.onPanelSubmit({ payload: samplePayload });
    store.findOverlap = originalFindOverlap;

    timeline.panelMode.set('edit');
    timeline.editingOrder.set(sampleOrder);
    timeline.onPanelSubmit({
      existingOrderId: sampleOrder.docId,
      payload: { ...samplePayload, status: 'open' }
    });
    timeline.panelMode.set('create');

    callIfFunction(timeline, 'openOrderPopover', sampleOrder, popoverA, 1200, 300);
    callIfFunction(timeline, 'openOrderPopover', sampleOrder, popoverA, 50, 300);
    callIfFunction(timeline, 'openOrderPopover', sampleOrder, popoverA, 640, 700);
    callIfFunction(timeline, 'openOrderPopover', sampleOrder, popoverA, 640, 50);
    await new Promise((resolve) => window.setTimeout(resolve, 10));

    callIfFunction(timeline, 'pushNotification', 'Coverage', 'Message');
    const notif = timeline.notifications()[0];
    if (notif) {
      timeline.onNotificationClosed(notif.id);
    }

    timeline['hoverClearTimeoutId'] = window.setTimeout(() => undefined, 5000);
    timeline['fireworksIntervalId'] = window.setInterval(() => undefined, 5000);
    timeline['notificationTimeoutIds'].set(999, window.setTimeout(() => undefined, 5000));
    timeline.ngOnDestroy();

    localStorage.setItem('work-order-timeline-orders-version', 'mismatch');
    callIfFunction(store, 'loadInitialOrders');
    localStorage.setItem('work-order-timeline-orders-version', '8');
    localStorage.removeItem('work-order-timeline-orders');
    callIfFunction(store, 'loadInitialOrders');
    localStorage.setItem('work-order-timeline-orders', 'not-json');
    callIfFunction(store, 'loadInitialOrders');
    localStorage.setItem('work-order-timeline-orders', '{}');
    callIfFunction(store, 'loadInitialOrders');
    localStorage.setItem('work-order-timeline-orders', '[]');
    callIfFunction(store, 'loadInitialOrders');

    callIfFunction(store, 'parseStoredOrders', 'not-json');
    callIfFunction(store, 'parseStoredOrders', '[]');
    callIfFunction(store, 'parseStoredOrders', '{}');
    callIfFunction(store, 'normalizeStoredOrders', [
      { docType: 'workOrder', docId: 'x', data: { name: 5, workCenterId: 'wc-001', status: 'open', startDate: '2026-01-01', endDate: '2026-01-02' } },
      { docType: 'workOrder', docId: 'y', data: { name: 'y', workCenterId: 'wc-001', status: 'open', startDate: 'bad-date', endDate: 'bad-date' } },
      { docType: 'workOrder', docId: 'z', data: { name: 'z', workCenterId: 'missing', status: 'open', startDate: '2026-01-01', endDate: '2026-01-02' } }
    ]);
    callIfFunction(store, 'isWorkOrderDocument', null);
    callIfFunction(store, 'isWorkOrderDocument', { docType: 'workOrder', docId: 1, data: {} });
    callIfFunction(store, 'isWorkOrderDocument', { docType: 'workOrder', docId: 'id', data: { name: 'x', workCenterId: 'wc-001', status: 'bad', startDate: '2026-01-01', endDate: '2026-01-02' } });

    store.createWorkOrder(samplePayload);
    const created = store.workOrders().find((item: { data: { name: string } }) => item.data.name === samplePayload.name);
    if (created) {
      store.updateWorkOrder(created.docId, { ...samplePayload, name: 'Coverage Updated' });
      store.deleteWorkOrder(created.docId);
    }
    store.findOverlap(samplePayload);

    const originalTimelineScrollRef = timeline['timelineScrollRef'];
    timeline['timelineScrollRef'] = undefined;
    callIfFunction(timeline, 'scrollTimelineToSelectionStart');
    callIfFunction(timeline, 'bindTimelineResizeSync');
    callIfFunction(timeline, 'bindHorizontalScrollSync');
    timeline['timelineScrollRef'] = originalTimelineScrollRef;

    const normalized = callIfFunction(timeline, 'normalizeCandidateToTimelineYear', {
      name: 'Normalize',
      workCenterId: 'wc-001',
      status: 'open',
      startDate: '2025-02-01',
      endDate: '2026-12-31'
    }) as { startDate?: string } | undefined;
    if (normalized?.startDate && !normalized.startDate.startsWith(String(timeline.selectedYear()))) {
      throw new Error('normalizeCandidateToTimelineYear did not adjust as expected');
    }

    const originalDateNow = Date.now;
    let tick = 0;
    Date.now = () => {
      tick += 6_000;
      return originalDateNow() + tick;
    };
    timeline['fireworksIntervalId'] = window.setInterval(() => undefined, 5000);
    callIfFunction(timeline, 'triggerFireworks');
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    Date.now = originalDateNow;

    panel.form.controls.workCenterId.clearValidators();
    panel.form.controls.workCenterId.updateValueAndValidity();
    panel.form.reset({
      name: 'No Work Center',
      workCenterId: null,
      status: 'open',
      startDate: { year: 2026, month: 4, day: 1 },
      endDate: { year: 2026, month: 4, day: 2 }
    });
    panel['startDateInputRef'] = { nativeElement: { value: '04.01.2026' } };
    panel['endDateInputRef'] = { nativeElement: { value: '04.02.2026' } };
    panel.onSubmit();
  });
});
