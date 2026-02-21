import { SAMPLE_WORK_ORDERS } from '../data/sample-data';
import { WorkOrderData } from '../models';
import { WorkOrderStoreService } from './work-order-store.service';
import { TestBed } from '@angular/core/testing';

describe('WorkOrderStoreService', () => {
  const STORAGE_KEY = 'work-order-timeline-orders';
  const STORAGE_VERSION_KEY = 'work-order-timeline-orders-version';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 1, 20));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    localStorage.clear();
  });

  function createCandidate(overrides: Partial<WorkOrderData> = {}): WorkOrderData {
    return {
      name: 'Test Order',
      workCenterId: 'wc-001',
      status: 'open',
      startDate: '2026-03-01',
      endDate: '2026-03-05',
      ...overrides
    };
  }

  function createService(): WorkOrderStoreService {
    return TestBed.runInInjectionContext(() => new WorkOrderStoreService());
  }

  it('loads sample data when storage version is missing or stale', () => {
    const staleOrders = JSON.stringify([{ bad: true }]);
    localStorage.setItem(STORAGE_VERSION_KEY, '7');
    localStorage.setItem(STORAGE_KEY, staleOrders);

    const service = createService();
    expect(service.workOrders().length).toBe(SAMPLE_WORK_ORDERS.length);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('parses valid stored orders and preserves empty stored arrays', () => {
    localStorage.setItem(STORAGE_VERSION_KEY, '8');
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          docId: 'wo-stored-1',
          docType: 'workOrder',
          data: {
            name: 'Stored',
            workCenterId: 'wc-001',
            status: 'open',
            startDate: '2026-01-01',
            endDate: '2026-01-05'
          }
        }
      ])
    );

    const service = createService();
    expect(service.workOrders()[0].docId).toBe('wo-stored-1');

    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    const serviceEmpty = createService();
    expect(serviceEmpty.workOrders()).toEqual([]);
  });

  it('falls back to sample data for invalid or incompatible stored payloads', () => {
    localStorage.setItem(STORAGE_VERSION_KEY, '8');
    localStorage.setItem(STORAGE_KEY, '{ invalid json');
    expect(createService().workOrders().length).toBe(SAMPLE_WORK_ORDERS.length);

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'array' }));
    expect(createService().workOrders().length).toBe(SAMPLE_WORK_ORDERS.length);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        null,
        {
          docId: 'bad',
          docType: 'workOrder',
          data: {
            name: 'Bad status',
            workCenterId: 'wc-001',
            status: 'oops',
            startDate: '2026-01-01',
            endDate: '2026-01-01'
          }
        }
      ])
    );
    expect(createService().workOrders().length).toBe(SAMPLE_WORK_ORDERS.length);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          docId: 123,
          docType: 'workOrder',
          data: null
        }
      ])
    );
    expect(createService().workOrders().length).toBe(SAMPLE_WORK_ORDERS.length);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          docId: 'missing-center',
          docType: 'workOrder',
          data: {
            name: 'Missing center',
            workCenterId: 'wc-999',
            status: 'open',
            startDate: '2026-01-01',
            endDate: '2026-01-01'
          }
        }
      ])
    );
    expect(createService().workOrders().length).toBe(SAMPLE_WORK_ORDERS.length);
  });

  it('creates, updates, deletes, groups and persists work orders', () => {
    localStorage.setItem(STORAGE_VERSION_KEY, '8');
    localStorage.removeItem(STORAGE_KEY);

    const service = createService();
    const nowSpy = spyOn(Date, 'now').and.returnValue(123456789);
    const randomSpy = spyOn(Math, 'random').and.returnValue(0.5);

    const created = service.createWorkOrder(createCandidate());
    expect(created.docId).toContain('wo-123456789-');

    const updated = createCandidate({ name: 'Updated', status: 'blocked' });
    service.updateWorkOrder(created.docId, updated);
    expect(service.workOrders().find((o) => o.docId === created.docId)?.data.name).toBe('Updated');

    const centerOrders = service.workOrdersByCenter().get('wc-001') ?? [];
    expect(centerOrders.length).toBeGreaterThan(0);

    jasmine.clock().tick(200);
    expect(localStorage.getItem(STORAGE_KEY)).toContain('Updated');
    expect(localStorage.getItem(STORAGE_VERSION_KEY)).toBe('8');

    service.deleteWorkOrder(created.docId);
    expect(service.workOrders().some((o) => o.docId === created.docId)).toBeFalse();

    nowSpy.and.callThrough();
    randomSpy.and.callThrough();
  });

  it('detects overlap and respects excluded order ids', () => {
    localStorage.setItem(STORAGE_VERSION_KEY, '8');
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          docId: 'wo-a',
          docType: 'workOrder',
          data: {
            name: 'A',
            workCenterId: 'wc-001',
            status: 'open',
            startDate: '2026-01-10',
            endDate: '2026-01-15'
          }
        }
      ])
    );

    const service = createService();

    const overlap = service.findOverlap(
      createCandidate({ workCenterId: 'wc-001', startDate: '2026-01-12', endDate: '2026-01-20' })
    );
    expect(overlap?.docId).toBe('wo-a');

    const excluded = service.findOverlap(
      createCandidate({ workCenterId: 'wc-001', startDate: '2026-01-12', endDate: '2026-01-20' }),
      'wo-a'
    );
    expect(excluded).toBeNull();

    const differentCenter = service.findOverlap(
      createCandidate({ workCenterId: 'wc-002', startDate: '2026-01-12', endDate: '2026-01-20' })
    );
    expect(differentCenter).toBeNull();

    const unknownCenter = service.findOverlap(
      createCandidate({ workCenterId: 'wc-404', startDate: '2026-01-12', endDate: '2026-01-20' })
    );
    expect(unknownCenter).toBeNull();
  });
});
