import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule as ngRouterModule } from '@angular/router';
import { CoreModule, BootstrapComponent, RouterModule, AppStateService } from '@c8y/ngx-components';
import { NodeRedAdminModule } from '@modules/node-red-admin/node-red-admin.module';
import { NodeRedDashboardModule } from '@modules/node-red-dashboard/node-red-dashboard.module';
import { filter } from 'rxjs/operators';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(),
    ngRouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'node-red/admin'
      }
    ], { enableTracing: false, useHash: true, initialNavigation: 'disabled' }),
    CoreModule.forRoot(),
    NodeRedAdminModule,
    NodeRedDashboardModule
  ],
  bootstrap: [BootstrapComponent],
})
export class AppModule {
  constructor(private appState: AppStateService, private router: Router) {
    this.appState.currentUser.pipe(filter(tmp => !!tmp)).subscribe(() => {
      this.router.initialNavigation();
    })
  }
}
