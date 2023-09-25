import { NgModule } from "@angular/core";
import { NodeRedIframeModule } from "@modules/node-red-iframe/node-red-iframe.module";
import {
  CoreModule,
  hookNavigator,
  hookRoute,
  hookTab,
} from "@c8y/ngx-components";
import { NodeRedIframeComponent } from "@modules/node-red-iframe/node-red-iframe.component";
import { NodeRedDashboardTabFactory } from "./dashboard-tab.factory";
import { NodeRedDashboardGuard } from "./dashboard.guard";

@NgModule({
  imports: [CoreModule, NodeRedIframeModule],
  declarations: [],
  providers: [
    hookRoute({
      path: "node-red/dashboard",
      component: NodeRedIframeComponent,
      data: {
        src: "/service/node-red/ui/",
      },
      // canActivate: [NodeRedDashboardGuard],
    }),
    hookTab(NodeRedDashboardTabFactory),
    hookNavigator(NodeRedDashboardGuard)
  ],
})
export class NodeRedDashboardModule {}
