import { NgModule } from "@angular/core";
import { NodeRedIframeModule } from "@modules/node-red-iframe/node-red-iframe.module";
import {
  CoreModule,
  hookNavigator,
  hookRoute,
  hookTab,
} from "@c8y/ngx-components";
import { NodeRedIframeComponent } from "@modules/node-red-iframe/node-red-iframe.component";
import { NodeRedAdminTabFactory } from "./admin-tab.factory";
import { NodeRedAdminGuard } from "./admin.guard";

@NgModule({
  imports: [CoreModule, NodeRedIframeModule],
  declarations: [],
  providers: [
    hookRoute({
      path: "node-red/admin",
      component: NodeRedIframeComponent,
      data: {
        src: "/service/node-red/",
      },
      // canActivate: [NodeRedAdminGuard],
      // tabs: [{label: 'test', icon: 'rocket', path: 'node-red/admin'}]
    }),
    hookTab(NodeRedAdminTabFactory),
    hookNavigator(NodeRedAdminGuard)
  ],
})
export class NodeRedAdminModule {}
