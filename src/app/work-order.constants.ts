import { WorkOrderStatus } from './models';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const TIMELINE_MONTH_OPTIONS: Array<{ value: number; label: string }> = MONTH_LABELS.map((label, index) => ({
  value: index,
  label
}));

export const DATEPICKER_MONTH_OPTIONS: Array<{ value: number; label: string }> = MONTH_LABELS.map((label, index) => ({
  value: index + 1,
  label
}));

export const WORK_ORDER_STATUS_OPTIONS: Array<{ value: WorkOrderStatus; label: string }> = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'complete', label: 'Complete' },
  { value: 'blocked', label: 'Blocked' }
];

export const WORK_ORDER_STATUS_LABELS: Record<WorkOrderStatus, string> = {
  open: 'Open',
  'in-progress': 'In progress',
  complete: 'Complete',
  blocked: 'Blocked'
};

