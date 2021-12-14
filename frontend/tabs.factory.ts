import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tab, TabFactory } from '@c8y/ngx-components';
import { Observable } from 'rxjs';

@Injectable()
export class NodeRedTabsFactory implements TabFactory {
  tabs: Tab[] = [];
  constructor() {
    this.tabs = [
      {
        label: 'Admin',
        path: 'admin',
        icon: 'cog'
      },
      {
        label: 'Dashboard',
        path: 'dashboard',
        icon: 'dashboard'
      }
    ]
  }

  get(activatedRoute?: ActivatedRoute): Tab | Tab[] | Observable<Tab | Tab[]> | Promise<Tab | Tab[]> {
    return this.tabs;
  }

}
