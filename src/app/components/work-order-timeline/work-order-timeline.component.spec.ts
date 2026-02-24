import { ElementRef, computed, signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { WorkCenterDocument, WorkOrderData, WorkOrderDocument } from '../../models';
import { WorkOrderStoreService } from '../../services/work-order-store.service';
import { WorkOrderTimelineComponent } from './work-order-timeline.component';

class MockStoreService {
  readonly workCenters = signal<WorkCenterDocument[]>([
    { docId: 'wc-001', docType: 'workCenter', data: { name: 'Center A' } },
    { docId: 'wc-002', docType: 'workCenter', data: { name: 'Center B' } }
  ]);

  readonly workOrders = signal<WorkOrderDocument[]>([
    {
      docId: 'wo-1',
      docType: 'workOrder',
      data: {
        name: 'Order 1',
        workCenterId: 'wc-001',
        status: 'open',
        startDate: '2026-01-02',
        endDate: '2026-01-05'
      }
    }
  ]);

  readonly workOrdersByCenter = computed(() => {
    const grouped = new Map<string, WorkOrderDocument[]>([
      ['wc-001', []],
      ['wc-002', []]
    ]);

    for (const order of this.workOrders()) {
      grouped.get(order.data.workCenterId)?.push(order);
    }

    return grouped;
  });

  createWorkOrder = jasmine.createSpy('createWorkOrder').and.callFake((data: WorkOrderData) => {
    const doc: WorkOrderDocument = { docId: 'wo-created', docType: 'workOrder', data };
    this.workOrders.update((orders) => [...orders, doc]);
    return doc;
  });

  updateWorkOrder = jasmine.createSpy('updateWorkOrder').and.callFake((docId: string, data: WorkOrderData) => {
    this.workOrders.update((orders) => orders.map((order) => (order.docId === docId ? { ...order, data } : order)));
  });

  deleteWorkOrder = jasmine.createSpy('deleteWorkOrder').and.callFake((docId: string) => {
    this.workOrders.update((orders) => orders.filter((order) => order.docId !== docId));
  });

  findOverlap = jasmine.createSpy('findOverlap').and.returnValue(null);
}

describe('WorkOrderTimelineComponent', () => {
  let fixture: ComponentFixture<WorkOrderTimelineComponent>;
  let component: WorkOrderTimelineComponent;
  let store: MockStoreService;

  beforeEach(async () => {
    store = new MockStoreService();

    await TestBed.configureTestingModule({
      imports: [WorkOrderTimelineComponent],
      providers: [{ provide: WorkOrderStoreService, useValue: store }]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderTimelineComponent);
    component = fixture.componentInstance;

    const scrollContainer = document.createElement('div');
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 800, configurable: true });
    Object.defineProperty(scrollContainer, 'scrollWidth', { value: 2200, configurable: true });
    component.timelineScrollRef = new ElementRef(scrollContainer);

    fixture.detectChanges();
  });

  it('tracks entities and toggles selectors/sort', () => {
    expect(component.trackCenter(0, store.workCenters()[0])).toBe('wc-001');
    expect(component.trackOrder(0, store.workOrders()[0])).toBe('wo-1');

    component.onSelectTimescale('week');
    component.onSelectYear(2027);
    component.onSelectMonth(3);

    expect(component.timescale()).toBe('week');
    expect(component.selectedYear()).toBe(2027);
    expect(component.selectedMonth()).toBe(3);
    expect(component.todayX()).toBeGreaterThanOrEqual(0);

    component.onToggleWorkCenterSort();
    expect(component.workCenterSortOrder()).toBe('asc');
    expect(component.workCenterSortLabel()).toBe('Work Center (A-Z)');
    component.onToggleWorkCenterSort();
    expect(component.workCenterSortOrder()).toBe('desc');
    expect(component.workCenterSortLabel()).toBe('Work Center (Z-A)');
    component.onToggleWorkCenterSort();
    expect(component.workCenterSortOrder()).toBe('default');
  });

  it('handles hover and track events', () => {
    jasmine.clock().install();
    const container = document.createElement('div');
    spyOn(container, 'getBoundingClientRect').and.returnValue({ left: 0 } as DOMRect);

    component.onTrackEnter({ currentTarget: container, clientX: 25 } as unknown as MouseEvent, 'wc-001');
    expect(component.hoveredCenterId()).toBe('wc-001');

    component.onTrackLeave();
    jasmine.clock().tick(41);
    expect(component.hoveredCenterId()).toBeNull();
    expect(component.hoveredSlot()).toBeNull();

    jasmine.clock().uninstall();
  });

  it('clears previous hover timeout paths', () => {
    const timeoutId = window.setTimeout(() => undefined, 1000);
    (component as any).hoverClearTimeoutId = timeoutId;
    component.onHoverCenter('wc-001');
    expect((component as any).hoverClearTimeoutId).toBeNull();

    (component as any).hoverClearTimeoutId = window.setTimeout(() => undefined, 1000);
    component.onHoverCenter(null);
    expect((component as any).hoverClearTimeoutId).not.toBeNull();
  });

  it('handles track click busy and open slot flows', () => {
    const busyEvent = {
      target: { closest: () => null },
      currentTarget: {
        getBoundingClientRect: () => ({ left: 0 })
      },
      clientX: 5
    } as unknown as MouseEvent;

    spyOn<any>(component, 'computeHoverSlot').and.returnValues(null, {
      centerId: 'wc-001',
      left: 10,
      width: 20,
      startDate: new Date(2026, 0, 1),
      endDate: new Date(2026, 0, 1)
    });

    component.onTrackClick(busyEvent, 'wc-001');
    expect(component.notifications().length).toBeGreaterThan(0);

    component.onTrackClick(busyEvent, 'wc-001');
    expect(component.panelOpen()).toBeTrue();
    expect(component.panelMode()).toBe('create');
  });

  it('ignores click on existing card and supports create button', () => {
    const cardClick = {
      target: { closest: () => ({}) },
      currentTarget: { getBoundingClientRect: () => ({ left: 0 }) },
      clientX: 10
    } as unknown as MouseEvent;

    component.panelOpen.set(false);
    component.onTrackClick(cardClick, 'wc-001');
    expect(component.panelOpen()).toBeFalse();

    component.onCreateButtonClick();
    expect(component.panelOpen()).toBeTrue();
  });

  it('renders today button tooltip with calendar icon', () => {
    const todayButton = fixture.nativeElement.querySelector('[data-testid="today-button"]') as HTMLButtonElement;
    const icon = todayButton.querySelector('img') as HTMLImageElement;
    const tooltipAnchor = todayButton.parentElement as HTMLDivElement;
    const expectedDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date());
    const tooltipText = `Go to today ${expectedDate}`;

    expect(todayButton).toBeTruthy();
    expect(todayButton.textContent?.trim()).toBe('Today');
    expect(todayButton.getAttribute('title')).toBeNull();
    expect(todayButton.getAttribute('aria-label')).toBe(tooltipText);
    expect(icon.getAttribute('src')).toBe('/assets/images/calendar.png');

    tooltipAnchor.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    const tooltip = fixture.nativeElement.querySelector('[data-testid="today-button-tooltip"]') as HTMLDivElement;
    expect(tooltip?.textContent?.trim()).toBe(tooltipText);

    tooltipAnchor.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="today-button-tooltip"]')).toBeNull();
  });

  it('goes to today and requests centered scrolling', () => {
    component.onSelectTimescale('day');

    const today = new Date();
    component.onSelectYear(today.getFullYear());
    component.onSelectMonth(today.getMonth());

    const scrollContainer = component.timelineScrollRef.nativeElement;
    Object.defineProperty(scrollContainer, 'scrollWidth', { value: 50000, configurable: true });
    scrollContainer.scrollLeft = 0;

    const scrollSpy = spyOn<any>(component, 'scrollTimelineToDate').and.callThrough();
    component.goToToday();

    expect(component.selectedYear()).toBe(today.getFullYear());
    expect(component.selectedMonth()).toBe(today.getMonth());
    expect(scrollSpy).toHaveBeenCalled();
    expect(scrollSpy.calls.mostRecent().args[1]).toBe('center');
  });

  it('executes queued timeline scroll callback for center and start alignments', fakeAsync(() => {
    const localFixture = TestBed.createComponent(WorkOrderTimelineComponent);
    const localComponent = localFixture.componentInstance;

    const scrollContainer = document.createElement('div');
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 800, configurable: true });
    Object.defineProperty(scrollContainer, 'scrollWidth', { value: 2200, configurable: true });
    localComponent.timelineScrollRef = new ElementRef(scrollContainer);

    localFixture.detectChanges();

    const scrollToDateSpy = spyOn<any>(localComponent, 'scrollTimelineToDate').and.callThrough();
    const scrollSelectionSpy = spyOn<any>(localComponent, 'scrollTimelineToSelectionStart').and.callThrough();

    flushMicrotasks();
    scrollToDateSpy.calls.reset();
    scrollSelectionSpy.calls.reset();

    (localComponent as any).nextTimelineScrollAlignment = 'center';
    localComponent.onSelectYear(localComponent.selectedYear() + 1);
    localFixture.detectChanges();
    flushMicrotasks();
    expect(scrollToDateSpy).toHaveBeenCalledWith(jasmine.any(Date), 'center');

    (localComponent as any).nextTimelineScrollAlignment = 'start';
    localComponent.onSelectMonth((localComponent.selectedMonth() + 1) % 12);
    localFixture.detectChanges();
    flushMicrotasks();
    expect(scrollSelectionSpy).toHaveBeenCalled();

    localFixture.destroy();
  }));

  it('handles popover card click and popover lifecycle', () => {
    const order = store.workOrders()[0];
    const popoverA = {
      isOpen: jasmine.createSpy('isOpen').and.returnValue(false),
      open: jasmine.createSpy('open'),
      close: jasmine.createSpy('close'),
      positionTarget: undefined as HTMLElement | undefined
    } as any;

    const popoverB = {
      isOpen: jasmine.createSpy('isOpen').and.returnValue(true),
      open: jasmine.createSpy('open'),
      close: jasmine.createSpy('close'),
      positionTarget: undefined as HTMLElement | undefined
    } as any;

    const event = {
      stopPropagation: jasmine.createSpy('stopPropagation'),
      clientX: 10,
      clientY: 10
    } as any;

    jasmine.clock().install();
    component.onOrderCardClick(event, order, popoverA);
    jasmine.clock().tick(1);
    expect(popoverA.open).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();

    popoverA.isOpen.and.returnValue(true);
    component.onOrderPopoverShown(popoverA);
    component.onOrderCardClick(event, order, popoverA);
    expect(popoverA.close).toHaveBeenCalled();

    component.onOrderPopoverShown(popoverA);
    component.onOrderCardClick(event, order, popoverB);
    expect(popoverA.close).toHaveBeenCalled();

    component.onOrderPopoverHidden(popoverA);
    expect(component.activePopoverOrder()).toBeTruthy();

    component.onOrderPopoverHidden(popoverB);
    expect(component.activePopoverOrder()).toBeNull();
    jasmine.clock().uninstall();
  });

  it('clears hover tooltip timeout when popover is shown', () => {
    const popover = { positionTarget: undefined, close: jasmine.createSpy('close') } as any;
    (component as any).orderHoverTooltipTimeoutId = window.setTimeout(() => undefined, 1000);
    (component as any).pendingHoveredOrderId = 'wo-1';
    component.hoveredOrderId.set('wo-1');

    component.onOrderPopoverShown(popover);

    expect((component as any).orderHoverTooltipTimeoutId).toBeNull();
    expect(component.hoveredOrderId()).toBeNull();
  });

  it('edits and deletes through popover actions', () => {
    const order = store.workOrders()[0];
    component.activePopoverOrder.set(order);

    const closeSpy = jasmine.createSpy('close');
    (component as any).activeOrderPopover = { close: closeSpy };

    const editSpy = spyOn(component, 'onEditOrder').and.callThrough();
    component.onOrderPopoverEdit();
    expect(editSpy).toHaveBeenCalledWith(order);

    const deleteSpy = spyOn(component, 'onDeleteOrder').and.callThrough();
    component.activePopoverOrder.set(order);
    component.onOrderPopoverDelete();
    expect(deleteSpy).toHaveBeenCalledWith(order);
  });

  it('opens edit panel and deletes order', () => {
    const order = store.workOrders()[0];
    component.onEditOrder(order);

    expect(component.panelMode()).toBe('edit');
    expect(component.panelWorkCenterId()).toBe('wc-001');
    expect(component.editingOrder()?.docId).toBe(order.docId);

    component.onDeleteOrder(order);
    expect(store.deleteWorkOrder).toHaveBeenCalledWith(order.docId);
    expect(component.notifications().some((n) => n.title === 'Deleted')).toBeTrue();
  });

  it('submits panel create/update/overlap/complete paths', () => {
    const basePayload: WorkOrderData = {
      name: 'Panel Order',
      workCenterId: 'wc-001',
      status: 'open',
      startDate: '2025-01-05',
      endDate: '2026-01-10'
    };

    component.onPanelSubmit({ payload: { ...basePayload, workCenterId: '' } });
    expect(store.createWorkOrder).not.toHaveBeenCalled();

    store.findOverlap.and.returnValue(store.workOrders()[0]);
    component.onPanelSubmit({ payload: basePayload });
    expect(component.panelOverlapError()).toContain('overlaps');

    store.findOverlap.and.returnValue(null);
    component.panelMode.set('edit');
    component.editingOrder.set(store.workOrders()[0]);
    component.onPanelSubmit({ payload: { ...basePayload, status: 'blocked' }, existingOrderId: 'wo-1' });
    expect(store.updateWorkOrder).toHaveBeenCalled();

    const fireworksSpy = spyOn<any>(component, 'triggerFireworks').and.stub();
    component.panelMode.set('create');
    component.onPanelSubmit({ payload: { ...basePayload, status: 'complete' } });
    expect(store.createWorkOrder).toHaveBeenCalled();
    expect(fireworksSpy).toHaveBeenCalled();

    component.onPanelSubmit({ payload: { ...basePayload, name: 'Regular Create', status: 'open' } });
    expect(component.notifications().some((n) => n.title === 'Created')).toBeTrue();
  });

  it('uses editingOrder doc id when existingOrderId is not provided and updates complete status verb', () => {
    component.panelMode.set('edit');
    component.editingOrder.set(store.workOrders()[0]);
    store.findOverlap.and.returnValue(null);

    component.onPanelSubmit({
      payload: {
        name: 'Edited Complete',
        workCenterId: 'wc-001',
        status: 'complete',
        startDate: '2026-01-05',
        endDate: '2026-01-06'
      }
    });

    expect(store.updateWorkOrder).toHaveBeenCalledWith('wo-1', jasmine.any(Object));
    expect(component.notifications().some((n) => n.message.includes('updated as complete'))).toBeTrue();
  });

  it('covers panel close wrapper', () => {
    component.panelOpen.set(true);
    component.onPanelClose();
    expect(component.panelOpen()).toBeFalse();
  });

  it('exposes order rendering helpers', () => {
    const order = store.workOrders()[0];

    expect(component.getOrdersForCenter('wc-001').length).toBeGreaterThan(0);
    expect(component.getOrdersForCenter('wc-404')).toEqual([]);
    expect(component.isOrderVisible(order)).toBeTrue();

    const style = component.orderStyle(order);
    expect(style['left']).toContain('px');
    expect(style['width']).toContain('px');

    expect(component.statusLabel('open')).toBe('Open');
    expect(component.statusClass('blocked')).toBe('status-blocked');
    expect(typeof component.shouldShowInlineStatus(order)).toBe('boolean');
    expect(component.orderDateLabel('2026-01-02')).toContain('2026');

    component.hoveredSlot.set({
      centerId: 'wc-001',
      left: 1,
      width: 2,
      startDate: new Date(2026, 0, 1),
      endDate: new Date(2026, 0, 1)
    });
    expect(component.hoveredSlotForCenter('wc-001')).toBeTruthy();
    expect(component.hoveredSlotForCenter('wc-002')).toBeNull();
  });

  it('handles notification close path', () => {
    const removeSpy = spyOn<any>(component, 'removeNotification').and.callThrough();
    component['notifications'].set([{ id: 1, title: 'A', message: 'B', tone: 'default' }]);
    component.onNotificationClosed(1);
    expect(removeSpy).toHaveBeenCalledWith(1);
  });

  it('covers guard returns for missing timeline refs and unsupported resize observer', () => {
    const originalTimelineRef = component.timelineScrollRef;
    (component as any).timelineScrollRef = undefined;
    (component as any).scrollTimelineToSelectionStart();

    const originalResize = (window as any).ResizeObserver;
    (window as any).ResizeObserver = undefined;
    (component as any).bindTimelineResizeSync();
    (window as any).ResizeObserver = originalResize;
    component.timelineScrollRef = originalTimelineRef;

    expect(component.timelineScrollRef).toBeDefined();
  });

  it('handles ngAfterViewInit and ngOnDestroy cleanup', () => {
    const observerSpy = jasmine.createSpy('observe');
    const disconnectSpy = jasmine.createSpy('disconnect');
    (window as any).ResizeObserver = class {
      constructor(private cb: () => void) {
        this.cb();
      }
      observe = observerSpy;
      disconnect = disconnectSpy;
    };

    component.ngAfterViewInit();
    expect(observerSpy).toHaveBeenCalled();

    const popover = { close: jasmine.createSpy('close') } as any;
    (component as any).activeOrderPopover = popover;
    (component as any).hoverClearTimeoutId = window.setTimeout(() => undefined, 1000);
    (component as any).fireworksIntervalId = window.setInterval(() => undefined, 1000);

    component.ngOnDestroy();
    expect(popover.close).toHaveBeenCalled();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('clears order hover tooltip timeout during destroy cleanup', () => {
    (component as any).orderHoverTooltipTimeoutId = window.setTimeout(() => undefined, 1000);
    component.ngOnDestroy();
    expect((component as any).orderHoverTooltipTimeoutId).toBeNull();
  });

  it('handles no-op popover edit/delete when no active order', () => {
    component.activePopoverOrder.set(null);
    component.onOrderPopoverEdit();
    component.onOrderPopoverDelete();
    expect(true).toBeTrue();
  });

  it('covers private helpers for display and fireworks', () => {
    const asc = (component as any).getDisplayedWorkCenters(store.workCenters(), 'asc');
    const desc = (component as any).getDisplayedWorkCenters(store.workCenters(), 'desc');
    const def = (component as any).getDisplayedWorkCenters(store.workCenters(), 'default');

    expect(asc[0].data.name).toBe('Center A');
    expect(desc[0].data.name).toBe('Center B');
    expect(def).toEqual(store.workCenters());

    expect((component as any).resolveWorkCenterName('wc-404')).toBe('selected work center');

    const random = (component as any).randomInRange(2, 4);
    expect(random).toBeGreaterThanOrEqual(2);
    expect(random).toBeLessThan(4);

    const setIntervalSpy = spyOn(window, 'setInterval').and.callFake(((cb: TimerHandler) => {
      (cb as () => void)();
      (cb as () => void)();
      return 1 as unknown as ReturnType<typeof setInterval>;
    }) as any);
    const clearIntervalSpy = spyOn(window, 'clearInterval').and.callThrough();

    spyOn(Date, 'now').and.returnValues(1000, 7000, 7000);
    (component as any).triggerFireworks();

    expect(setIntervalSpy).toHaveBeenCalled();
    expect(clearIntervalSpy).toBeDefined();
  });

  it('covers normalization edge-cases and notification timeout map removal', () => {
    jasmine.clock().install();
    component.selectedYear.set(2026);

    const sameYear = (component as any).normalizeCandidateToTimelineYear({
      name: 'A',
      workCenterId: 'wc-001',
      status: 'open',
      startDate: '2026-01-05',
      endDate: '2026-01-06'
    });
    expect(sameYear.startDate).toBe('2026-01-05');

    const invalidAdjusted = (component as any).normalizeCandidateToTimelineYear({
      name: 'B',
      workCenterId: 'wc-001',
      status: 'open',
      startDate: '2025-12-31',
      endDate: '2025-01-01'
    });
    expect(invalidAdjusted.startDate).toBe('2025-12-31');

    component.notifications.set([{ id: 10, title: 'A', message: 'B', tone: 'default' }]);
    (component as any).notificationTimeoutIds.set(10, window.setTimeout(() => undefined, 1000));
    (component as any).removeNotification(10);
    expect(component.notifications()).toEqual([]);

    (component as any).pushNotification('Timer', 'Should auto remove');
    jasmine.clock().tick(5001);
    expect(component.notifications().some((n) => n.title === 'Timer')).toBeFalse();
    jasmine.clock().uninstall();
  });

  it('resolves selected work center name and month-based scroll focus', () => {
    component.panelWorkCenterId.set('wc-001');
    expect(component.selectedWorkCenterName()).toBe('Center A');

    component.onSelectTimescale('month');
    expect(component.todayX()).toBeGreaterThanOrEqual(0);
    (component as any).scrollTimelineToSelectionStart();
    expect(component.timelineScrollRef.nativeElement.scrollLeft).toBeGreaterThanOrEqual(0);
  });

  it('covers fireworks branches for active interval and confetti path', () => {
    (component as any).fireworksIntervalId = 123;
    const clearIntervalSpy = spyOn(window, 'clearInterval').and.callThrough();
    const setIntervalSpy = spyOn(window, 'setInterval').and.callFake(((cb: TimerHandler) => {
      (cb as () => void)();
      return 321 as unknown as ReturnType<typeof setInterval>;
    }) as any);

    spyOn(Date, 'now').and.returnValues(1000, 2000);
    (component as any).triggerFireworks();

    expect(clearIntervalSpy).toHaveBeenCalledWith(123);
    expect(setIntervalSpy).toHaveBeenCalled();
  });

  it('renders a single native scroll container with sticky header and left column hooks', () => {
    const scrollPane = fixture.nativeElement.querySelector('[data-testid="timeline-scroll-pane"]') as HTMLElement;
    const header = fixture.nativeElement.querySelector('[data-testid="timeline-right-header"]') as HTMLElement;
    const leftHeaderCell = fixture.nativeElement.querySelector('[data-testid="timeline-left-pane"]') as HTMLElement;
    const headerTrack = fixture.nativeElement.querySelector('[data-testid="header-track-content"]') as HTMLElement;

    expect(scrollPane).toBeTruthy();
    expect(header).toBeTruthy();
    expect(leftHeaderCell).toBeTruthy();
    expect(headerTrack).toBeTruthy();
    expect(scrollPane.contains(header)).toBeTrue();
    expect(scrollPane.contains(leftHeaderCell)).toBeTrue();
    expect(getComputedStyle(header).position).toBe('sticky');
  });

  it('clears hover tooltip timeout on track leave', () => {
    component.hoveredOrderId.set('wo-1');
    (component as any).pendingHoveredOrderId = 'wo-1';
    (component as any).orderHoverTooltipTimeoutId = window.setTimeout(() => undefined, 1000);

    component.onTrackLeave();

    expect((component as any).orderHoverTooltipTimeoutId).toBeNull();
    expect(component.hoveredOrderId()).toBeNull();
  });

  it('handles order bar hover when popover is active', () => {
    const order = store.workOrders()[0];
    component.activePopoverOrder.set(order);
    component.hoveredOrderId.set(order.docId);
    (component as any).pendingHoveredOrderId = order.docId;
    (component as any).orderHoverTooltipTimeoutId = window.setTimeout(() => undefined, 1000);

    component.onOrderBarEnter(order);

    expect((component as any).pendingHoveredOrderId).toBeNull();
    expect((component as any).orderHoverTooltipTimeoutId).toBeNull();
    expect(component.hoveredOrderId()).toBeNull();
  });

  it('shows delayed order hover tooltip and respects leave/cancel flows', () => {
    jasmine.clock().install();
    const order = store.workOrders()[0];

    component.onOrderBarEnter(order);
    expect((component as any).pendingHoveredOrderId).toBe(order.docId);
    expect(component.hoveredOrderId()).toBeNull();

    jasmine.clock().tick(999);
    expect(component.hoveredOrderId()).toBeNull();
    jasmine.clock().tick(1);
    expect(component.hoveredOrderId()).toBe(order.docId);

    // Cover clearing an existing hover timeout before scheduling a new one.
    (component as any).orderHoverTooltipTimeoutId = window.setTimeout(() => undefined, 1000);
    component.onOrderBarEnter(order);
    component.onOrderBarLeave();
    expect((component as any).pendingHoveredOrderId).toBeNull();
    expect((component as any).orderHoverTooltipTimeoutId).toBeNull();
    expect(component.hoveredOrderId()).toBeNull();

    jasmine.clock().uninstall();
  });

  it('covers fireworks end branch that clears active interval id', () => {
    let intervalCallback: any = null;
    spyOn(window, 'setInterval').and.callFake(((cb: TimerHandler) => {
      intervalCallback = cb;
      return 456 as unknown as ReturnType<typeof setInterval>;
    }) as any);
    const clearSpy = spyOn(window, 'clearInterval').and.callThrough();

    spyOn(Date, 'now').and.returnValues(1000, 7000);
    (component as any).triggerFireworks();
    if (intervalCallback) {
      intervalCallback();
    }

    expect(clearSpy).toHaveBeenCalledWith(456);
  });
});
