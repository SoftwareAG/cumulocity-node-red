import { Injectable } from '@angular/core';
import {
  AppStateService,
  gettext,
  NavigatorNode,
  Permissions
} from '@c8y/ngx-components';
import { NodeRedNavigatorNodeCheck } from '../models/role-check';

@Injectable({
  providedIn: 'root'
})
export class NodeRedAdminGuard extends NodeRedNavigatorNodeCheck {
protected requiredRoles: string[] = ['ROLE_NODE_RED_ADMIN'];
  protected readonly navNode: NavigatorNode = new NavigatorNode({
    path: `/node-red/admin`,
    label: gettext('Node-RED Admin'),
    icon: 'cog',
    preventDuplicates: true
  });

  constructor(
    permissions: Permissions,
    appState: AppStateService,
  ) {
      super(permissions, appState)
  }
}
