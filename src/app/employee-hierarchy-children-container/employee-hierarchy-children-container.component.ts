import { Component, Input, OnInit } from '@angular/core';
import { Function } from '../shared/interfaces/function';

@Component({
  selector: 'app-employee-hierarchy-children-container',
  templateUrl: './employee-hierarchy-children-container.component.html',
  styleUrls: ['./employee-hierarchy-children-container.component.css']
})
export class EmployeeHierarchyChildrenContainerComponent implements OnInit {

  @Input() node: Function | undefined = undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
