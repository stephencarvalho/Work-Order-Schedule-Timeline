const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const TIMELINE_MONTH_OPTIONS = MONTH_LABELS.map((label, index) => ({
    value: index,
    label
}));
export const DATEPICKER_MONTH_OPTIONS = MONTH_LABELS.map((label, index) => ({
    value: index + 1,
    label
}));
export const WORK_ORDER_STATUS_OPTIONS = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In progress' },
    { value: 'complete', label: 'Complete' },
    { value: 'blocked', label: 'Blocked' }
];
export const WORK_ORDER_STATUS_LABELS = {
    open: 'Open',
    'in-progress': 'In progress',
    complete: 'Complete',
    blocked: 'Blocked'
};
