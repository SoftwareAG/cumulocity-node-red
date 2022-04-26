import { Injectable } from '@angular/core';
import {
  AppStateService,
  gettext,
  NavigatorNode,
  Permissions
} from '@c8y/ngx-components';
import { NodeRedNavigatorNodeCheck } from '@models/role-check';

@Injectable({ providedIn: 'root' })
export class NodeRedDashboardGuard extends NodeRedNavigatorNodeCheck {
  protected requiredRoles: string[] = ['ROLE_NODE_RED_READ', 'ROLE_NODE_RED_ADMIN'];
  protected readonly navNode: NavigatorNode = new NavigatorNode({
    path: `/node-red/dashboard`,
    label: gettext('Node-RED Dashboard'),
    icon: 'dashboard',
    preventDuplicates: true
  });

  constructor(
    protected permissions: Permissions,
    protected appState: AppStateService,
  ) {
      super(permissions, appState)
  }
}
