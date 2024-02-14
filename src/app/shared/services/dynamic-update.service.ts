import { Injectable } from '@angular/core';
import { FunctionTreeService } from './function-tree.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicUpdateService {

  private UPDATE_INTERVAL = 1000 * 60 * 60; // every 1h

  constructor(
    private functionTreeService: FunctionTreeService
  ) {

    this.update();
  }

  update() {
    this.functionTreeService.updateFunctionTree();

    // deactivate for now
    //setTimeout(() => this.update(), this.UPDATE_INTERVAL);
  }
}
