import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule as ngRouterModule } from '@angular/router';
import { CoreModule, BootstrapComponent, RouterModule } from '@c8y/ngx-components';
import { NodeRedIframeComponent } from './node-red-iframe/node-red-iframe.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(),
    ngRouterModule.forRoot([
      {path: '', component: NodeRedIframeComponent}
    ], { enableTracing: false, useHash: true }),
    CoreModule.forRoot()
  ],
  bootstrap: [BootstrapComponent],
   declarations: [
    NodeRedIframeComponent
  ]
})
export class AppModule {}
