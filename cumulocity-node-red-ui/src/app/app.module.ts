import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule as ngRouterModule } from '@angular/router';
import { BootstrapComponent, CoreModule, RouterModule } from '@c8y/ngx-components';
import { NodeRedAdminModule } from './node-red-admin/node-red-admin.module';
import { NodeRedDashboardModule } from './node-red-dashboard/node-red-dashboard.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ngRouterModule.forRoot([], { enableTracing: false, useHash: true }),
    RouterModule.forRoot(),
    CoreModule.forRoot(),
    NodeRedAdminModule,
    NodeRedDashboardModule
  ],
  bootstrap: [BootstrapComponent]
})
export class AppModule {}
