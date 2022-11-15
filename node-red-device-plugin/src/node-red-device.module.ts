import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule, HOOK_TABS, HOOK_ONCE_ROUTE, ViewContext, FormsModule, TabsModule } from '@c8y/ngx-components';
import { NodeRedDeviceGuard } from './node-red-device.guard';
import { NodeRedIframeComponent } from './node-red-iframe.component';


const routes: Routes = [
    {
        path: 'nodered',
        component: NodeRedIframeComponent
    }
];

@NgModule({
    declarations: [NodeRedIframeComponent],
    imports: [
        RouterModule.forChild(routes), CoreModule, FormsModule
    ],
    entryComponents: [NodeRedIframeComponent],
    providers: [
        NodeRedDeviceGuard,
        {
            provide: HOOK_ONCE_ROUTE,
            multi: true,
            useValue: [{
                context: ViewContext.Device,
                path: 'nodered',
                component: NodeRedIframeComponent,
                label: 'Node Red',
                priority: 2000,
                icon: 'card-security',
                canActivate: [NodeRedDeviceGuard],
                data: {
                    src: "/service/node-red/",
                },
            }],


        }]
})
export class NodeRedDeviceModule { }