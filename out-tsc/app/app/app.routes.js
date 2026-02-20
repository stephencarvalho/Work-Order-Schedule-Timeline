import { LayoutComponent } from './layout/layout.component';
import { WorkOrderTimelineComponent } from './components/work-order-timeline/work-order-timeline.component';
export const routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: WorkOrderTimelineComponent
            }
        ]
    }
];
