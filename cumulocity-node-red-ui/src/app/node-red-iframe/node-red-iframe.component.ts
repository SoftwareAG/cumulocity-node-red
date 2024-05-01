import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AlertService, AppStateService, gettext, ModalService } from '@c8y/ngx-components';
import { FetchClient, TenantOptionsService, UserService } from '@c8y/client';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-node-red-iframe',
  templateUrl: './node-red-iframe.component.html'
})
export class NodeRedIframeComponent implements OnDestroy {
  hasRequiredRoles = false;
  currentUserSubscription: Subscription;
  private iframeURL: string;

  @ViewChild('iframe') iframe: ElementRef | undefined;

  constructor(
    private route: ActivatedRoute,
    private appState: AppStateService,
    private userService: UserService,
    private alertService: AlertService,
    private client: FetchClient,
    private tenantOptions: TenantOptionsService,
    private modalService: ModalService
  ) {
    this.iframeURL = this.route.snapshot.data['src'];
    this.currentUserSubscription = this.appState.currentUser.subscribe((user) => {
      if (user) {
        if (this.userService.hasAnyRole(user, ['ROLE_NODE_RED_ADMIN', 'ROLE_NODE_RED_READ'])) {
          this.hasRequiredRoles = true;
          this.setupIframe();
        } else {
          this.hasRequiredRoles = false;
          this.alertService.warning(gettext('You are missing the required roles to access the Node-RED backend.'));
        }
      } else {
        this.hasRequiredRoles = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

  private async setupIframe() {

    // workaround to get rid of the basic auth login prompt
    let preAuthSent = false;
    const options = this.client.getFetchOptions();
    if (options && options.headers) {
      const headers: {[key: string]: string} = options.headers
      const authString = headers['Authorization'] || headers['authorization'];
      if (authString) {
        if (authString.startsWith('Basic ')) {
          const base64 = authString.replace('Basic ', '');
          const decoded = atob(base64);
          const userSeparatorIndex = decoded.indexOf(':');
          const user = decoded.substring(0, userSeparatorIndex);
          const password = decoded.substring(userSeparatorIndex + 1);
          // pre-authenticate iframe in case of basic auth
          const req = new XMLHttpRequest();
          req.open('GET', this.iframeURL, false, user, password);
          req.send();
          preAuthSent = true;
        }
      }
    }

    // using OAuth
    if (!preAuthSent) {
      try {
        const { data } = await this.tenantOptions.detail({category: 'jwt', key: 'xsrf-validation.enabled'});
        if (data.value !== 'false') {
          throw Error('');
        }
      } catch (e) {
        this.alertService.add({
          text: gettext(`To use Node-RED on a tenant that uses OAuth, you have to disable XSRF-Token validation. By closing this message we will try do this for you.`),
          detailedData: gettext(`To disable XSRF-Token validation, you have to set the tenant option with the category: 'jwt', key: 'xsrf-validation.enabled' to the value: 'false'.`),
          type: 'warning',
          timeout: 0,
          onClose: () => {this.disableXSRFTokenValidation()}
        });
        return;
      }
    }

    this.setIframeUrl();
  }

  private async disableXSRFTokenValidation() {
    try {
      await this.modalService.confirm(gettext(`Disable XSRF-Token validation`), gettext(`Are you sure that you would like to disable XSRF-Token validation?`), 'warning', { ok: gettext('Disable XSRF-Token validation'), cancel: gettext('Cancel')});
    } catch (e) {
      // nothing to do, modal was canceled.
      return;
    }
    try {
      await this.tenantOptions.update({category: 'jwt', key: 'xsrf-validation.enabled', value: 'false'});
    } catch (e) {
      this.alertService.warning(gettext('Failed to disable XSRF-Token validation.'));
    }
    
    this.setIframeUrl();
  }

  private setIframeUrl() {
    // set iFrame's SRC attribute
    const iframe: HTMLIFrameElement = this.iframe?.nativeElement;
    iframe.src = this.iframeURL;
  }
}
