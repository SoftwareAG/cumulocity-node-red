import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AppStateService, NavigatorNode, NavigatorNodeFactory, Permissions, Tab, TabFactory } from "@c8y/ngx-components";
import { Observable } from "rxjs";
import { filter, map, take, tap } from 'rxjs/operators';
import * as appPkg from '../../package.json'

export abstract class NodeRedPermissionCheck implements CanActivate {
  protected abstract requiredRoles: string[];

  constructor(
    protected permissions: Permissions,
    protected appState: AppStateService
  ) {}

  canActivate(): Observable<boolean> {
    return this.appState.currentUser.pipe(
        filter(user => !!user),
        take(1),
        map(() => this.permissions.hasAnyRole(this.requiredRoles)),
    );
  }
}

export abstract class NodeRedNavigatorNodeCheck extends NodeRedPermissionCheck implements NavigatorNodeFactory {
    protected abstract readonly navNode: NavigatorNode;
  
    constructor(
      protected permissions: Permissions,
      protected appState: AppStateService
    ) {
        super(permissions, appState);
    }

    get(activatedRoute?: ActivatedRoute): NavigatorNode[] | Observable<NavigatorNode | NavigatorNode[]> {
        if (this.appState.state?.app?.contextPath !== shortenContextPath(appPkg.c8y.application.contextPath)) {
            return this.canActivate().pipe(map((hasRole) => hasRole ? this.navNode : []));
            }
            return [];
    }
  }

export abstract class NodeRedTabsCheck implements TabFactory {
    protected abstract readonly tab: Tab;

    constructor(
        protected router: Router,
        protected appState: AppStateService
    ) {}

    get(activatedRoute?: ActivatedRoute): Tab | Tab[] | Observable<Tab | Tab[]> | Promise<Tab | Tab[]> {
        const url = this.router.url;
        if (this.appState.state?.app?.contextPath === shortenContextPath(appPkg.c8y.application.contextPath)) {
        return this.tab;
        }
        return [];
    }
}

function shortenContextPath(cp: string) {
    return cp.replace('-plugins', '');
}
