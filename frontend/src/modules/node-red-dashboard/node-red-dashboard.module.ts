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
import { NodeRedDashboardTabFactory } from "./dashboard-tab.factory";
import { NodeRedDashboardGuard } from "./dashboard.guard";

@NgModule({
  imports: [CoreModule, NodeRedIframeModule],
  declarations: [],
  providers: [
    {
      provide: HOOK_ROUTE,
      useValue: [
        {
          path: "node-red/dashboard",
          component: NodeRedIframeComponent,
          data: {
            src: "/service/node-red/ui/",
          },
          // canActivate: [NodeRedDashboardGuard],
        },
      ] as Route[],
      multi: true,
    },
    {
      provide: HOOK_TABS,
      useClass: NodeRedDashboardTabFactory,
      multi: true,
    },
    {
      provide: HOOK_NAVIGATOR_NODES,
      useClass: NodeRedDashboardGuard,
      multi: true
    },
  ],
})
export class NodeRedDashboardModule {}