import { Injectable, Optional } from '@angular/core';
import { AlertService, AppStateService, LoginService } from '@c8y/ngx-components';
import {
  FetchClient,
  BasicAuth,
  Realtime,
  UserService,
  TenantService,
  CookieAuth
} from '@c8y/ngx-components/api';
import { ApiService, TenantLoginOptionsService } from '@c8y/ngx-components/api';
import { LocationStrategy } from '@angular/common';
import { IAuthentication, ICredentials } from '@c8y/client';

@Injectable()
export class CustomLoginService extends LoginService {

  constructor(
    client: FetchClient,
    private _basicAuth: BasicAuth,
    private _cookieAuth: CookieAuth,
    ui: AppStateService,
    user: UserService,
    tenant: TenantService,
    realtime: Realtime,
    alert: AlertService,
    api: ApiService,
    tenantLoginOptionsService: TenantLoginOptionsService,
    @Optional() location: LocationStrategy
  ) {
    super(client, _basicAuth, _cookieAuth, ui, user, tenant, realtime, alert, api, tenantLoginOptionsService, location);
  }

  /**
   * makes sure that Basic Auth is always used as login strategy
   * @param credentials 
   */
  getAuthStrategy(): IAuthentication {
    super.getAuthStrategy();
    return this._basicAuth;
  }

  /**
   * makes sure that Basic Auth login is not upgraded to CookieAuth
   * @param credentials 
   */
  isPasswordGrantLogin(credentials?: ICredentials) {
    return false;
  }
  
  /**
   * Perform CookieAuth logout before logging in via Basic Auth
   * @param auth 
   * @param credentials 
   */
  async login(auth: IAuthentication = this.getAuthStrategy(), credentials?: ICredentials) {
    try {
      await this._cookieAuth.logout();
    } catch (e) {
      console.error(e);
    }
    return super.login(auth, credentials);
  }
}
