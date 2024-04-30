import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService, Tab } from '@c8y/ngx-components';
import { NodeRedTabsCheck } from '../models/role-check';

@Injectable({ providedIn: 'root' })
export class NodeRedDashboardTabFactory extends NodeRedTabsCheck {
  protected tab: Tab = {
    label: 'Dashboard',
    path: 'node-red/dashboard',
    icon: 'dashboard'
  };

  constructor(router: Router, appState: AppStateService) {
    super(router, appState);
  }
}
