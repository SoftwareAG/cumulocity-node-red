import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeRedIframeComponent } from './node-red-iframe.component';
import { CoreModule } from '@c8y/ngx-components';

@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  declarations: [NodeRedIframeComponent],
  exports: [NodeRedIframeComponent]
})
export class NodeRedIframeModule { }
