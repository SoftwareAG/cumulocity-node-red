import { NgModule } from "@angular/core";
import { NodeRedIframeModule } from "@modules/node-red-iframe/node-red-iframe.module";
import {
  CoreModule,
  gettext,
  HOOK_NAVIGATOR_NODES,
  HOOK_ROUTE,
  HOOK_TABS,
  NavigatorNodeData,
  Route,
} from "@c8y/ngx-components";
import { NodeRedIframeComponent } from "@modules/node-red-iframe/node-red-iframe.component";
import { NodeRedAdminTabFactory } from "./admin-tab.factory";
import { NodeRedAdminGuard } from "./admin.guard";

@NgModule({
  imports: [CoreModule, NodeRedIframeModule],
  declarations: [],
  providers: [
    {
      provide: HOOK_ROUTE,
      useValue: [
        {
          path: "node-red/admin",
          component: NodeRedIframeComponent,
          data: {
            src: "/service/node-red/",
          },
          // canActivate: [NodeRedAdminGuard],
          // tabs: [{label: 'test', icon: 'rocket', path: 'node-red/admin'}]
        },
      ] as Route[],
      multi: true,
    },
    {
      provide: HOOK_TABS,
      useClass: NodeRedAdminTabFactory,
      multi: true,
    },
    {
      provide: HOOK_NAVIGATOR_NODES,
      useClass: NodeRedAdminGuard,
      multi: true,
    }
  ],
})
export class NodeRedAdminModule {}
