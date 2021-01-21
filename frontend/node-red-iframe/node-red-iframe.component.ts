import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { AlertService, AppStateService } from '@c8y/ngx-components';
import { FetchClient, UserService } from '@c8y/ngx-components/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-node-red-iframe',
  templateUrl: './node-red-iframe.component.html',
  styleUrls: ['./node-red-iframe.component.less']
})
export class NodeRedIframeComponent implements OnDestroy, AfterViewInit {
  hasRequiredRoles = false;
  currentUserSubscription: Subscription;
  iframeID = 'node-red-iframe';
  constructor(
    private appState: AppStateService,
    private userService: UserService,
    private alertService: AlertService,
    private client: FetchClient
  ) {}

  ngAfterViewInit(): void {
    this.currentUserSubscription = this.appState.currentUser.subscribe((user) => {
      if (user) {
        if (this.userService.hasAnyRole(user, ['ROLE_NODE_RED_ADMIN', 'ROLE_NODE_RED_READ'])) {
          this.hasRequiredRoles = true;
          this.setupIframe();
        } else {
          this.hasRequiredRoles = false;
          this.alertService.warning('You are missing the required roles to access the Node RED backend.');
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

  setupIframe() {
    const iframeURL = '/service/node-red/';

    // workaround to get rid of the basic auth login prompt
    const options = this.client.getFetchOptions();
    if (options && options.headers) {
      const headers: {[key: string]: string} = options.headers
      if (headers['Authorization'] || headers['authorization']) {
        const authString = headers['Authorization'] || headers['authorization'];
        if (authString.startsWith('Basic ')) {
          const base64 = authString.replace('Basic ', '');
          const decoded = atob(base64);
          const userSeparatorIndex = decoded.indexOf(':');
          const user = decoded.substring(0, userSeparatorIndex);
          const password = decoded.substring(userSeparatorIndex + 1);
          // pre-authenticate iframe in case of basic auth
          const req = new XMLHttpRequest();
          req.open("GET", iframeURL, false, user, password);
          req.send(null);
        }
      }
    }

    // set iFrame's SRC attribute
    const iFrameWin = document.getElementById(this.iframeID);
    iFrameWin['src'] = iframeURL;
  }

}
