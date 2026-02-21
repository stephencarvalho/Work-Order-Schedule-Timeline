import { routes } from './app.routes';

describe('app.routes', () => {
  it('defines root and child lazy routes', async () => {
    expect(routes.length).toBe(1);
    expect(routes[0].path).toBe('');
    expect(routes[0].children?.[0].path).toBe('');

    const layout = await routes[0].loadComponent?.();
    expect(layout).toBeTruthy();

    const timeline = await routes[0].children?.[0].loadComponent?.();
    expect(timeline).toBeTruthy();
  });
});
