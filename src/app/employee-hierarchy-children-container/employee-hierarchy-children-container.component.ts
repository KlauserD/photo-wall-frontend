import { Component, Input, OnInit } from '@angular/core';
import { Role } from '../shared/interfaces/role';

@Component({
  selector: 'app-employee-hierarchy-children-container',
  templateUrl: './employee-hierarchy-children-container.component.html',
  styleUrls: ['./employee-hierarchy-children-container.component.css']
})
export class EmployeeHierarchyChildrenContainerComponent implements OnInit {

  @Input() node: Role | undefined = undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
