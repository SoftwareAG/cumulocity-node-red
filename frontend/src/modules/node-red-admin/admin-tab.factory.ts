import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService, Tab } from '@c8y/ngx-components';
import { NodeRedTabsCheck } from '@models/role-check';

@Injectable({ providedIn: 'root' })
export class NodeRedAdminTabFactory extends NodeRedTabsCheck {
  protected tab: Tab = {
    label: 'Admin',
    path: 'node-red/admin',
    icon: 'cog'
  };

  constructor(protected router: Router, protected appState: AppStateService) {
    super(router, appState);
  }
}
