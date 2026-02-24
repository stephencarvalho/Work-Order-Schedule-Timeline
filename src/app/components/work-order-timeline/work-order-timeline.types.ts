import { Timescale, TimelineColumn, WorkOrderStatus } from '../../models';

export interface TimelineProjection {
  startDate: Date;
  endDate: Date;
  columns: TimelineColumn[];
  width: number;
  columnWidth: number;
}

export interface OrderPlacement {
  left: number;
  width: number;
}

export interface HoverSlot {
  centerId: string;
  left: number;
  width: number;
  startDate: Date;
  endDate: Date;
}

export interface PushNotification {
  id: number;
  title: string;
  message: string;
  tone: 'default' | 'complete' | 'warning';
}

export type WorkCenterSortOrder = 'default' | 'asc' | 'desc';

export const SCALE_OPTIONS: Array<{ value: Timescale; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' }
];

export const STATUS_CLASS: Record<WorkOrderStatus, string> = {
  open: 'status-open',
  'in-progress': 'status-in-progress',
  complete: 'status-complete',
  blocked: 'status-blocked'
};

export const STATUS_PILL_MIN_WIDTH: Record<WorkOrderStatus, number> = {
  open: 51,
  'in-progress': 87,
  complete: 63,
  blocked: 67
};

export const CARD_HORIZONTAL_PADDING = 20;
export const CARD_CONTENT_GAP = 12;
export const MIN_NAME_WIDTH_WITH_STATUS = 56;
export const MONTH_VIEW_VISIBLE_COLUMNS = 6;
export const MONTH_VIEW_MOBILE_VISIBLE_COLUMNS = 2;
export const MONTH_VIEW_MOBILE_BREAKPOINT = 600;
