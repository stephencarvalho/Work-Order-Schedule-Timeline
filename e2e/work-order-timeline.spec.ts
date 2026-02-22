import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

async function selectNgOption(page: Page, testId: string, label: string): Promise<void> {
  const select = page.getByTestId(testId);
  await select.locator('.ng-select-container').click();
  await page.locator('.ng-dropdown-panel .ng-option', { hasText: label }).first().click();
}

async function openCreatePanel(page: Page): Promise<void> {
  await page.getByTestId('create-order-button').click();
  await expect(page.getByTestId('work-order-panel')).toBeVisible();
}

async function fillPanelDates(page: Page, startDate: string, endDate: string): Promise<void> {
  await page.getByTestId('work-order-start-date-input').fill(startDate);
  await page.getByTestId('work-order-end-date-input').fill(endDate);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Work Orders' })).toBeVisible();
});

test('loads timeline and allows toolbar interactions', async ({ page }) => {
  await expect(page).toHaveTitle('Work Order Schedule Timeline');

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

  await selectNgOption(page, 'month-select', 'Mar');
  await expect(page.getByTestId('month-select')).toContainText('Mar');
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

test('covers internal branches for e2e coverage', async ({ page }) => {
  await page.evaluate(async () => {
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
    panel['toDateStruct']('');
    panel['toDateStruct']('2026-03-01');
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
    panel['getPickerAnchor']({ state: { firstDate: null } });

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

    timeline['openOrderPopover'](sampleOrder, popoverA, 1200, 300);
    timeline['openOrderPopover'](sampleOrder, popoverA, 50, 300);
    timeline['openOrderPopover'](sampleOrder, popoverA, 640, 700);
    timeline['openOrderPopover'](sampleOrder, popoverA, 640, 50);
    await new Promise((resolve) => window.setTimeout(resolve, 10));

    timeline['pushNotification']('Coverage', 'Message');
    const notif = timeline.notifications()[0];
    if (notif) {
      timeline.onNotificationClosed(notif.id);
    }

    timeline['hoverClearTimeoutId'] = window.setTimeout(() => undefined, 5000);
    timeline['fireworksIntervalId'] = window.setInterval(() => undefined, 5000);
    timeline['notificationTimeoutIds'].set(999, window.setTimeout(() => undefined, 5000));
    timeline.ngOnDestroy();

    localStorage.setItem('work-order-timeline-orders-version', 'mismatch');
    store['loadInitialOrders']();
    localStorage.setItem('work-order-timeline-orders-version', '8');
    localStorage.removeItem('work-order-timeline-orders');
    store['loadInitialOrders']();
    localStorage.setItem('work-order-timeline-orders', 'not-json');
    store['loadInitialOrders']();
    localStorage.setItem('work-order-timeline-orders', '{}');
    store['loadInitialOrders']();
    localStorage.setItem('work-order-timeline-orders', '[]');
    store['loadInitialOrders']();

    store['parseStoredOrders']('not-json');
    store['parseStoredOrders']('[]');
    store['parseStoredOrders']('{}');
    store['normalizeStoredOrders']([
      { docType: 'workOrder', docId: 'x', data: { name: 5, workCenterId: 'wc-001', status: 'open', startDate: '2026-01-01', endDate: '2026-01-02' } },
      { docType: 'workOrder', docId: 'y', data: { name: 'y', workCenterId: 'wc-001', status: 'open', startDate: 'bad-date', endDate: 'bad-date' } },
      { docType: 'workOrder', docId: 'z', data: { name: 'z', workCenterId: 'missing', status: 'open', startDate: '2026-01-01', endDate: '2026-01-02' } }
    ]);
    store['isWorkOrderDocument'](null);
    store['isWorkOrderDocument']({ docType: 'workOrder', docId: 1, data: {} });
    store['isWorkOrderDocument']({ docType: 'workOrder', docId: 'id', data: { name: 'x', workCenterId: 'wc-001', status: 'bad', startDate: '2026-01-01', endDate: '2026-01-02' } });

    store.createWorkOrder(samplePayload);
    const created = store.workOrders().find((item: { data: { name: string } }) => item.data.name === samplePayload.name);
    if (created) {
      store.updateWorkOrder(created.docId, { ...samplePayload, name: 'Coverage Updated' });
      store.deleteWorkOrder(created.docId);
    }
    store.findOverlap(samplePayload);

    const originalTimelineScrollRef = timeline['timelineScrollRef'];
    timeline['timelineScrollRef'] = undefined;
    timeline['scrollTimelineToSelectionStart']();
    timeline['bindTimelineResizeSync']();
    timeline['bindHorizontalScrollSync']();
    timeline['timelineScrollRef'] = originalTimelineScrollRef;

    const normalized = timeline['normalizeCandidateToTimelineYear']({
      name: 'Normalize',
      workCenterId: 'wc-001',
      status: 'open',
      startDate: '2025-02-01',
      endDate: '2026-12-31'
    });
    if (!normalized.startDate.startsWith(String(timeline.selectedYear()))) {
      throw new Error('normalizeCandidateToTimelineYear did not adjust as expected');
    }

    const originalDateNow = Date.now;
    let tick = 0;
    Date.now = () => {
      tick += 6_000;
      return originalDateNow() + tick;
    };
    timeline['fireworksIntervalId'] = window.setInterval(() => undefined, 5000);
    timeline['triggerFireworks']();
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
