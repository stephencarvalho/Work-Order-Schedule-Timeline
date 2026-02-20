import { Injectable, computed, effect, signal } from '@angular/core';
import { SAMPLE_WORK_CENTERS, SAMPLE_WORK_ORDERS } from '../data/sample-data';
import { fromIsoDate, toIsoDate } from '../utils/date-utils';
import * as i0 from "@angular/core";
const STORAGE_KEY = 'work-order-timeline-orders';
const STORAGE_VERSION_KEY = 'work-order-timeline-orders-version';
const STORAGE_VERSION = '8';
export class WorkOrderStoreService {
    constructor() {
        this.workCenters = signal(SAMPLE_WORK_CENTERS, ...(ngDevMode ? [{ debugName: "workCenters" }] : []));
        this.workOrders = signal(this.loadInitialOrders(), ...(ngDevMode ? [{ debugName: "workOrders" }] : []));
        this.workOrdersByCenter = computed(() => {
            const grouped = new Map();
            for (const center of this.workCenters()) {
                grouped.set(center.docId, []);
            }
            for (const order of this.workOrders()) {
                const existing = grouped.get(order.data.workCenterId) ?? [];
                existing.push(order);
                grouped.set(order.data.workCenterId, existing);
            }
            for (const [key, orders] of grouped.entries()) {
                grouped.set(key, orders.sort((a, b) => a.data.startDate.localeCompare(b.data.startDate)));
            }
            return grouped;
        }, ...(ngDevMode ? [{ debugName: "workOrdersByCenter" }] : []));
        effect(() => {
            if (typeof window === 'undefined') {
                return;
            }
            const value = JSON.stringify(this.workOrders());
            window.localStorage.setItem(STORAGE_KEY, value);
            window.localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
        });
    }
    createWorkOrder(data) {
        const doc = {
            docId: this.generateId(),
            docType: 'workOrder',
            data
        };
        this.workOrders.update((orders) => [...orders, doc]);
        return doc;
    }
    updateWorkOrder(docId, data) {
        this.workOrders.update((orders) => orders.map((order) => order.docId === docId
            ? {
                ...order,
                data
            }
            : order));
    }
    deleteWorkOrder(docId) {
        this.workOrders.update((orders) => orders.filter((order) => order.docId !== docId));
    }
    findOverlap(candidate, excludedOrderId) {
        const candidateStart = fromIsoDate(candidate.startDate).getTime();
        const candidateEnd = fromIsoDate(candidate.endDate).getTime();
        for (const order of this.workOrders()) {
            if (order.data.workCenterId !== candidate.workCenterId) {
                continue;
            }
            if (excludedOrderId && order.docId === excludedOrderId) {
                continue;
            }
            const existingStart = fromIsoDate(order.data.startDate).getTime();
            const existingEnd = fromIsoDate(order.data.endDate).getTime();
            if (candidateStart <= existingEnd && candidateEnd >= existingStart) {
                return order;
            }
        }
        return null;
    }
    loadInitialOrders() {
        if (typeof window === 'undefined') {
            return SAMPLE_WORK_ORDERS;
        }
        const storedVersion = window.localStorage.getItem(STORAGE_VERSION_KEY);
        if (storedVersion !== STORAGE_VERSION) {
            window.localStorage.removeItem(STORAGE_KEY);
            return SAMPLE_WORK_ORDERS;
        }
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return SAMPLE_WORK_ORDERS;
        }
        try {
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed)) {
                return SAMPLE_WORK_ORDERS;
            }
            const knownCenterIds = new Set(SAMPLE_WORK_CENTERS.map((center) => center.docId));
            const normalized = parsed
                .filter((item) => item?.docType === 'workOrder' && !!item?.docId && !!item?.data)
                .map((item) => ({
                ...item,
                data: {
                    ...item.data,
                    startDate: toIsoDate(fromIsoDate(item.data.startDate)),
                    endDate: toIsoDate(fromIsoDate(item.data.endDate))
                }
            }))
                .filter((item) => knownCenterIds.has(item.data.workCenterId));
            // If persisted data is from an older dataset and no longer maps to current work centers,
            // fall back to sample data so the timeline always renders orders.
            return normalized.length > 0 ? normalized : SAMPLE_WORK_ORDERS;
        }
        catch {
            return SAMPLE_WORK_ORDERS;
        }
    }
    generateId() {
        const randomPart = Math.random().toString(36).slice(2, 8);
        return `wo-${Date.now()}-${randomPart}`;
    }
    static { this.ɵfac = function WorkOrderStoreService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WorkOrderStoreService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: WorkOrderStoreService, factory: WorkOrderStoreService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WorkOrderStoreService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
