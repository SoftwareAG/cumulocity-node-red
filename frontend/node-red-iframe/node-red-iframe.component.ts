import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertService, AppStateService } from '@c8y/ngx-components';
import { UserService } from '@c8y/ngx-components/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-node-red-iframe',
  templateUrl: './node-red-iframe.component.html',
  styleUrls: ['./node-red-iframe.component.less']
})
export class NodeRedIframeComponent implements OnInit, OnDestroy {
  hasRequiredRoles = false;
  currentUserSubscription: Subscription;
  constructor(
    private appState: AppStateService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.currentUserSubscription = this.appState.currentUser.subscribe((user) => {
      if (user) {
        if (this.userService.hasAnyRole(user, ['ROLE_NODE_RED_ADMIN', 'ROLE_NODE_RED_READ'])) {
          this.hasRequiredRoles = true;
        } else {
          this.hasRequiredRoles = false;
          this.alertService.warning('You are missing the required roles to access the Node RED backend.');
        }
      } else {
        this.hasRequiredRoles = false;
      }
    });
  }

  ngOnInit() {
    
  }

  ngOnDestroy(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

}
