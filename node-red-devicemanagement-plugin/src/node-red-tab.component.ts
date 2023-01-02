import { Component, OnInit } from '@angular/core';
import { IManagedObject, InventoryService, IOperation, IResult, IResultList, OperationService } from '@c8y/client';

import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-node-red-tab',
  templateUrl: './node-red-tab.component.html'
})
export class NodeRedTabComponent implements OnInit {

  private deviceId: string;
  device: IResult<IManagedObject>
  flows: IResultList<IManagedObject>
  selectedFlow: IManagedObject
  private queryFlows: object = {

  }
  private filterFlows: object = {
    query: `$filter=(full.type eq 'tab' and has(c8y_noderedV2))`
  }



  constructor(
    private route: ActivatedRoute, private inventory: InventoryService, private operations: OperationService
  ) { }

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.parent.data.contextData["id"];
    this.loadData()
  }

  async loadData() {
    this.device = await (await this.inventory.detail(this.deviceId))
    this.flows = await this.inventory.list(this.filterFlows);
    console.log(this.flows)
  }

  flowChanged(flow): void {
    this.selectedFlow = flow;
  }

  async save() {
    let queryNodes: object = {
      query: `$filter=(full.z eq '${this.selectedFlow.full.id}' and has(c8y_noderedV2))`
    }
    let nodes = await (await this.inventory.list(queryNodes)).data.map(res => res.full)
    let flow = {
      id: this.selectedFlow.full.id,
      label: this.selectedFlow.full.label,
      disable: false,
      info: this.selectedFlow.full.info,
      env: [],
      nodes: nodes
    }
    var encoded = btoa(JSON.stringify(flow))
    const operation: IOperation = {
      deviceId: this.deviceId,
      c8y_NodeRed: {
        type: "create"
      },
      description: `Inject the node-red flow "${this.selectedFlow.full.label}" to the runtime on the device.`,
      data: encoded
    }
    this.operations.create(operation)
    console.log(flow)

  }


}
