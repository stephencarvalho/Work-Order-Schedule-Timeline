import { Injectable, computed, effect, signal } from '@angular/core';

import { SAMPLE_WORK_CENTERS, SAMPLE_WORK_ORDERS } from '../data/sample-data';
import { WorkCenterDocument, WorkOrderData, WorkOrderDocument } from '../models';
import { fromIsoDate, toIsoDate } from '../utils/date-utils';

const STORAGE_KEY = 'work-order-timeline-orders';
const STORAGE_VERSION_KEY = 'work-order-timeline-orders-version';
const STORAGE_VERSION = '8';
const VALID_STATUSES = new Set(['open', 'in-progress', 'complete', 'blocked']);

@Injectable({ providedIn: 'root' })
export class WorkOrderStoreService {
  private readonly persistDebounceMs = 150;

  // Static reference data for work centers. This does not change at runtime.
  readonly workCenters = signal<WorkCenterDocument[]>(SAMPLE_WORK_CENTERS);
  // Mutable source-of-truth for work orders; initialized from localStorage fallback.
  readonly workOrders = signal<WorkOrderDocument[]>(this.loadInitialOrders());

  // Derived index for fast lookups/rendering: centerId -> sorted work orders.
  readonly workOrdersByCenter = computed(() => {
    const grouped = new Map(
      this.workCenters().map((center) => [center.docId, [] as WorkOrderDocument[]])
    );

    for (const order of this.workOrders()) {
      grouped.get(order.data.workCenterId)?.push(order);
    }

    for (const orders of grouped.values()) {
      // ISO dates sort lexicographically in chronological order (YYYY-MM-DD).
      orders.sort((a, b) => a.data.startDate.localeCompare(b.data.startDate));
    }

    return grouped;
  });

  constructor() {
    // Reactive persistence with debouncing to reduce synchronous localStorage churn.
    effect((onCleanup) => {
      /* istanbul ignore next */
      if (typeof window === 'undefined') {
        // Guard for non-browser execution contexts.
        return;
      }

      const value = JSON.stringify(this.workOrders());
      const timeoutId = window.setTimeout(() => {
        window.localStorage.setItem(STORAGE_KEY, value);
        window.localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
      }, this.persistDebounceMs);

      onCleanup(() => {
        window.clearTimeout(timeoutId);
      });
    });
  }

  // Creates a new work-order document and appends it to the store.
  createWorkOrder(data: WorkOrderData): WorkOrderDocument {
    const doc: WorkOrderDocument = {
      docId: this.generateId(),
      docType: 'workOrder',
      data
    };

    this.workOrders.update((orders) => [...orders, doc]);
    return doc;
  }

  // Replaces the data payload for a specific work order by docId.
  updateWorkOrder(docId: string, data: WorkOrderData): void {
    this.workOrders.update((orders) =>
      orders.map((order) =>
        order.docId === docId
          ? {
              ...order,
              data
            }
          : order
      )
    );
  }

  // Removes a work order from the store by docId.
  deleteWorkOrder(docId: string): void {
    this.workOrders.update((orders) => orders.filter((order) => order.docId !== docId));
  }

  // Returns the first overlapping order in the same work center, or null if none.
  // excludedOrderId is used during edit flows so an order does not conflict with itself.
  findOverlap(candidate: WorkOrderData, excludedOrderId?: string): WorkOrderDocument | null {
    const candidateStart = fromIsoDate(candidate.startDate).getTime();
    const candidateEnd = fromIsoDate(candidate.endDate).getTime();
    const centerOrders = this.workOrdersByCenter().get(candidate.workCenterId) ?? [];

    for (const order of centerOrders) {
      if (excludedOrderId && order.docId === excludedOrderId) {
        continue;
      }

      const existingStart = fromIsoDate(order.data.startDate).getTime();
      const existingEnd = fromIsoDate(order.data.endDate).getTime();

      // Closed-interval overlap check:
      // [candidateStart, candidateEnd] intersects [existingStart, existingEnd]
      if (candidateStart <= existingEnd && candidateEnd >= existingStart) {
        return order;
      }
    }

    return null;
  }

  // Bootstraps initial work-order state from localStorage with defensive validation.
  private loadInitialOrders(): WorkOrderDocument[] {
    /* istanbul ignore next */
    if (typeof window === 'undefined') {
      return SAMPLE_WORK_ORDERS;
    }

    const storedVersion = window.localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== STORAGE_VERSION) {
      // Schema/data contract changed: discard stale persisted payload.
      window.localStorage.removeItem(STORAGE_KEY);
      return SAMPLE_WORK_ORDERS;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return SAMPLE_WORK_ORDERS;
    }

    return this.parseStoredOrders(stored);
  }

  // Parses persisted payload and applies top-level validation/fallback policy.
  private parseStoredOrders(stored: string): WorkOrderDocument[] {
    try {
      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return SAMPLE_WORK_ORDERS;
      }

      // Preserve legitimate empty datasets (user intentionally removed all orders).
      if (parsed.length === 0) {
        return [];
      }

      return this.normalizeStoredOrders(parsed);
    } catch {
      return SAMPLE_WORK_ORDERS;
    }
  }

  // Validates shape, normalizes dates, and enforces center referential integrity.
  private normalizeStoredOrders(parsed: unknown[]): WorkOrderDocument[] {
    const knownCenterIds = new Set(SAMPLE_WORK_CENTERS.map((center) => center.docId));
    const normalized = parsed
      // Structural guard: only keep records that look like work-order documents.
      .filter((item): item is WorkOrderDocument => this.isWorkOrderDocument(item))
      .map((item) => ({
        ...item,
        data: {
          ...item.data,
          // Normalize any user-edited/stale date values into canonical ISO format.
          startDate: toIsoDate(fromIsoDate(item.data.startDate)),
          endDate: toIsoDate(fromIsoDate(item.data.endDate))
        }
      }))
      // Referential integrity: drop work orders targeting unknown work centers.
      .filter((item) => knownCenterIds.has(item.data.workCenterId));

    // If persisted data is from an older dataset and no longer maps to current work centers,
    // fall back to sample data so the timeline always renders orders.
    return normalized.length > 0 ? normalized : SAMPLE_WORK_ORDERS;
  }

  // Generates an application-level document id: prefix + epoch millis + random base36 suffix.
  private generateId(): string {
    // base36 compacts random bytes to URL-safe lowercase alphanumerics.
    const randomPart = Math.random().toString(36).slice(2, 8);
    return `wo-${Date.now()}-${randomPart}`;
  }

  private isWorkOrderDocument(value: unknown): value is WorkOrderDocument {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Partial<WorkOrderDocument>;
    if (candidate.docType !== 'workOrder' || typeof candidate.docId !== 'string' || !candidate.data) {
      return false;
    }

    return (
      typeof candidate.data.name === 'string' &&
      typeof candidate.data.workCenterId === 'string' &&
      typeof candidate.data.status === 'string' &&
      VALID_STATUSES.has(candidate.data.status) &&
      typeof candidate.data.startDate === 'string' &&
      typeof candidate.data.endDate === 'string'
    );
  }
}
