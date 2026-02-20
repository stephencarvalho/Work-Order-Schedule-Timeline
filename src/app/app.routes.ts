import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/work-order-timeline/work-order-timeline.component').then((m) => m.WorkOrderTimelineComponent)
      }
    ]
  }
];
