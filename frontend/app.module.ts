import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule as ngRouterModule } from '@angular/router';
import { CoreModule, BootstrapComponent, RouterModule, HOOK_TABS } from '@c8y/ngx-components';
import { NodeRedTabsFactory } from './tabs.factory';
import { NodeRedIframeComponent } from './node-red-iframe/node-red-iframe.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(),
    ngRouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'admin'
      },
      {
        path: 'admin',
        component: NodeRedIframeComponent,
        data: {
          src: '/service/node-red/'
        }
      },
      {
        path: 'dashboard',
        component: NodeRedIframeComponent,
        data: {
          src: '/service/node-red/ui/'
        }
      }
    ], { enableTracing: false, useHash: true }),
    CoreModule.forRoot()
  ],
  bootstrap: [BootstrapComponent],
  declarations: [
    NodeRedIframeComponent
  ],
  providers: [
    {
      provide: HOOK_TABS,
      useClass: NodeRedTabsFactory,
      multi: true
    }
  ]
})
export class AppModule {}
