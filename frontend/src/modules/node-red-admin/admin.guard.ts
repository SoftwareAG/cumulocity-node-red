import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate } from '@angular/router';
import {
  AppStateService,
  gettext,
  NavigatorNode,
  NavigatorNodeFactory,
  Permissions
} from '@c8y/ngx-components';
import { NodeRedNavigatorNodeCheck } from '@models/role-check';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

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
    protected permissions: Permissions,
    protected appState: AppStateService,
  ) {
      super(permissions, appState)
  }
}
