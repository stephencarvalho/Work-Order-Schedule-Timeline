export type PopoverPlacement = 'top' | 'bottom' | 'start' | 'end';

export function resolvePopoverPlacement(clickX: number, clickY: number): PopoverPlacement {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const estimatedPopoverWidth = 320;
  const estimatedPopoverHeight = 280;

  const roomRight = viewportWidth - clickX;
  const roomLeft = clickX;
  const roomBottom = viewportHeight - clickY;
  const roomTop = clickY;

  if (roomRight < estimatedPopoverWidth && roomLeft >= estimatedPopoverWidth) {
    return 'start';
  }

  if (roomLeft < estimatedPopoverWidth && roomRight >= estimatedPopoverWidth) {
    return 'end';
  }

  if (roomBottom < estimatedPopoverHeight && roomTop >= estimatedPopoverHeight) {
    return 'top';
  }

  if (roomTop < estimatedPopoverHeight && roomBottom >= estimatedPopoverHeight) {
    return 'bottom';
  }

  return roomRight >= roomLeft ? 'end' : 'start';
}

export function createPopoverClickAnchor(clickX: number, clickY: number, existingAnchor: HTMLElement | null): HTMLElement {
  existingAnchor?.remove();

  const anchor = document.createElement('span');
  anchor.className = 'work-order-popover-click-anchor';
  anchor.style.position = 'fixed';
  anchor.style.left = `${clickX}px`;
  anchor.style.top = `${clickY}px`;
  anchor.style.width = '1px';
  anchor.style.height = '1px';
  anchor.style.pointerEvents = 'none';
  anchor.style.opacity = '0';
  anchor.style.zIndex = '-1';
  document.body.appendChild(anchor);

  return anchor;
}
