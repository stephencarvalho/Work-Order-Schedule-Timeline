export interface BaseDocument<TType extends string, TData> {
  docId: string;
  docType: TType;
  data: TData;
}

export interface WorkCenterData {
  name: string;
}

export interface WorkOrderData {
  name: string;
  workCenterId: string;
  status: WorkOrderStatus;
  startDate: string;
  endDate: string;
}

export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

export type Timescale = 'day' | 'week' | 'month';

export interface WorkCenterDocument extends BaseDocument<'workCenter', WorkCenterData> {}

export interface WorkOrderDocument extends BaseDocument<'workOrder', WorkOrderData> {}

export interface TimelineColumn {
  index: number;
  label: string;
  startDate: Date;
  endDate: Date;
  left: number;
  width: number;
}
