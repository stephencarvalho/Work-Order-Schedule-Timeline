import { createPopoverClickAnchor, resolvePopoverPlacement } from './work-order-timeline.popover';

describe('work-order-timeline.popover', () => {
  it('chooses placement based on available viewport space', () => {
    const innerWidthSpy = spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1000);
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(900);

    expect(resolvePopoverPlacement(800, 200)).toBe('start');
    expect(resolvePopoverPlacement(100, 200)).toBe('end');
    expect(resolvePopoverPlacement(400, 850)).toBe('top');
    expect(resolvePopoverPlacement(400, 50)).toBe('bottom');
    expect(resolvePopoverPlacement(500, 450)).toBe('end');
    expect(resolvePopoverPlacement(900, 450)).toBe('start');

    innerWidthSpy.and.returnValue(2000);
    expect(resolvePopoverPlacement(1200, 450)).toBe('start');
  });

  it('creates and replaces click anchor element', () => {
    const first = createPopoverClickAnchor(10, 20, null);
    expect(first.parentElement).toBe(document.body);
    expect(first.style.left).toBe('10px');

    const second = createPopoverClickAnchor(30, 40, first);
    expect(first.isConnected).toBeFalse();
    expect(second.style.left).toBe('30px');
    expect(second.style.top).toBe('40px');

    second.remove();
  });
});
