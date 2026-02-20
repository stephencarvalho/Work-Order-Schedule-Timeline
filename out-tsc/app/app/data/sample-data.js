import { addDays, startOfDay, toIsoDate } from '../utils/date-utils';
const today = startOfDay(new Date());
const WORK_CENTER_COUNT = 100;
const WORK_ORDER_COUNT = 200;
const STATUSES = ['open', 'in-progress', 'complete', 'blocked'];
const nextStartByCenter = new Map();
const seedYear = today.getFullYear();
const GENERATED_CENTER_INDEXES = Array.from({ length: 88 }, (_unused, index) => index + 1); // wc-002..wc-089
function centerId(index) {
    return `wc-${String(index + 1).padStart(3, '0')}`;
}
function centerName(index) {
    return `Work Center ${String(index + 1).padStart(3, '0')}`;
}
export const SAMPLE_WORK_CENTERS = Array.from({ length: WORK_CENTER_COUNT }, (_unused, index) => ({
    docId: centerId(index),
    docType: 'workCenter',
    data: {
        name: centerName(index)
    }
}));
const GENERATED_WORK_ORDERS = Array.from({ length: WORK_ORDER_COUNT }, (_unused, index) => {
    // Reserve wc-001 and wc-090..wc-100 for explicit edge-case scenarios.
    const wcIndex = GENERATED_CENTER_INDEXES[index % GENERATED_CENTER_INDEXES.length];
    const wcKey = centerId(wcIndex);
    const initialStart = new Date(seedYear, 0, 1 + (wcIndex % 14));
    const state = nextStartByCenter.get(wcKey) ?? initialStart;
    const startDate = state;
    const durationDays = 10 + (index % 10);
    const endDate = addDays(startDate, durationDays);
    const nextStart = addDays(endDate, 1);
    nextStartByCenter.set(wcKey, nextStart);
    return {
        docId: `wo-${String(index + 1).padStart(3, '0')}`,
        docType: 'workOrder',
        data: {
            name: `Work Order ${String(index + 1).padStart(3, '0')}`,
            workCenterId: wcKey,
            status: STATUSES[index % STATUSES.length],
            startDate: toIsoDate(startDate),
            endDate: toIsoDate(endDate)
        }
    };
});
const WORK_CENTER_ONE_ORDERS = [
    {
        docId: 'wo-wc001-01',
        docType: 'workOrder',
        data: {
            name: 'WC001 Order 01',
            workCenterId: centerId(0),
            status: 'open',
            startDate: '2025-12-20',
            endDate: '2026-01-16'
        }
    },
    {
        docId: 'wo-wc001-02',
        docType: 'workOrder',
        data: {
            name: 'WC001 Order 02',
            workCenterId: centerId(0),
            status: 'in-progress',
            startDate: '2026-01-17',
            endDate: '2026-02-02'
        }
    },
    {
        docId: 'wo-wc001-03',
        docType: 'workOrder',
        data: {
            name: 'WC001 Order 03',
            workCenterId: centerId(0),
            status: 'complete',
            startDate: '2026-02-03',
            endDate: '2026-02-20'
        }
    },
    {
        docId: 'wo-wc001-04',
        docType: 'workOrder',
        data: {
            name: 'WC001 Order 04',
            workCenterId: centerId(0),
            status: 'blocked',
            startDate: '2026-02-21',
            endDate: '2026-03-10'
        }
    }
];
const CROSS_YEAR_EDGE_CASE_ORDERS = [
    {
        docId: 'wo-edge-prev-current',
        docType: 'workOrder',
        data: {
            name: 'Edge Prev->Current Year',
            workCenterId: centerId(89), // wc-090
            status: 'open',
            startDate: '2024-12-15',
            endDate: '2025-01-10'
        }
    },
    {
        docId: 'wo-edge-current-next',
        docType: 'workOrder',
        data: {
            name: 'Edge Current->Next Year',
            workCenterId: centerId(90), // wc-091
            status: 'in-progress',
            startDate: '2025-12-15',
            endDate: '2026-01-20'
        }
    },
    {
        docId: 'wo-edge-dec31-jan01',
        docType: 'workOrder',
        data: {
            name: 'Edge Dec31->Jan01',
            workCenterId: centerId(91), // wc-092
            status: 'complete',
            startDate: '2025-12-31',
            endDate: '2026-01-01'
        }
    },
    {
        docId: 'wo-edge-multi-year-long',
        docType: 'workOrder',
        data: {
            name: 'Edge Multi-Year Long',
            workCenterId: centerId(92), // wc-093
            status: 'blocked',
            startDate: '2024-11-01',
            endDate: '2026-02-15'
        }
    },
    {
        docId: 'wo-edge-leap-cross',
        docType: 'workOrder',
        data: {
            name: 'Edge Leap Year Cross',
            workCenterId: centerId(93), // wc-094
            status: 'open',
            startDate: '2023-12-30',
            endDate: '2024-03-01'
        }
    },
    {
        docId: 'wo-edge-end-jan01',
        docType: 'workOrder',
        data: {
            name: 'Edge End On Jan01',
            workCenterId: centerId(94), // wc-095
            status: 'in-progress',
            startDate: '2025-11-01',
            endDate: '2026-01-01'
        }
    },
    {
        docId: 'wo-edge-start-dec31',
        docType: 'workOrder',
        data: {
            name: 'Edge Start On Dec31',
            workCenterId: centerId(95), // wc-096
            status: 'complete',
            startDate: '2025-12-31',
            endDate: '2026-02-01'
        }
    },
    {
        docId: 'wo-edge-week-cross',
        docType: 'workOrder',
        data: {
            name: 'Edge Week Cross-Year',
            workCenterId: centerId(96), // wc-097
            status: 'blocked',
            startDate: '2026-12-28',
            endDate: '2027-01-03'
        }
    },
    {
        docId: 'wo-edge-min-boundary',
        docType: 'workOrder',
        data: {
            name: 'Edge Min Boundary',
            workCenterId: centerId(97), // wc-098
            status: 'open',
            startDate: '2019-12-15',
            endDate: '2020-01-10'
        }
    },
    {
        docId: 'wo-edge-max-boundary',
        docType: 'workOrder',
        data: {
            name: 'Edge Max Boundary',
            workCenterId: centerId(98), // wc-099
            status: 'in-progress',
            startDate: '2030-12-20',
            endDate: '2031-01-10'
        }
    },
    {
        docId: 'wo-edge-very-long',
        docType: 'workOrder',
        data: {
            name: 'Edge Very Long Span',
            workCenterId: centerId(99), // wc-100
            status: 'complete',
            startDate: '2025-06-01',
            endDate: '2027-03-01'
        }
    }
];
export const SAMPLE_WORK_ORDERS = [
    ...WORK_CENTER_ONE_ORDERS,
    ...CROSS_YEAR_EDGE_CASE_ORDERS,
    ...GENERATED_WORK_ORDERS
];
