import { SAMPLE_WORK_CENTERS, SAMPLE_WORK_ORDERS } from './sample-data';

describe('sample-data', () => {
  it('generates expected work center collection', () => {
    expect(SAMPLE_WORK_CENTERS).toHaveSize(100);
    expect(SAMPLE_WORK_CENTERS[0].docId).toBe('wc-001');
    expect(SAMPLE_WORK_CENTERS[99].data.name).toBe('Work Center 100');
  });

  it('includes explicit edge-case orders and generated orders', () => {
    expect(SAMPLE_WORK_ORDERS.length).toBeGreaterThan(200);
    expect(SAMPLE_WORK_ORDERS.some((o) => o.docId === 'wo-edge-prev-current')).toBeTrue();
    expect(SAMPLE_WORK_ORDERS.some((o) => o.docId === 'wo-wc001-04')).toBeTrue();

    const generated = SAMPLE_WORK_ORDERS.find((o) => o.docId === 'wo-001');
    expect(generated).toBeTruthy();
    expect(generated?.data.workCenterId).toMatch(/^wc-\d{3}$/);
  });
});
