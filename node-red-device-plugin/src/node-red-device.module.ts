import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule, HOOK_TABS, HOOK_ONCE_ROUTE, ViewContext, FormsModule, TabsModule } from '@c8y/ngx-components';
import { ItemSelector } from './item_selector/item-selector.component';
import { NodeRedDeviceGuard } from './node-red-device.guard';
import { NodeRedTabComponent } from './node-red-tab.component';


const routes: Routes = [
    {
        path: 'nodered',
        component: NodeRedTabComponent
    }
];

@NgModule({
    declarations: [NodeRedTabComponent, ItemSelector],
    imports: [
        RouterModule.forChild(routes), CoreModule, FormsModule
    ],
    entryComponents: [NodeRedTabComponent],
    providers: [
        NodeRedDeviceGuard,
        {
            provide: HOOK_ONCE_ROUTE,
            multi: true,
            useValue: [{
                context: ViewContext.Device,
                path: 'nodered',
                component: NodeRedTabComponent,
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