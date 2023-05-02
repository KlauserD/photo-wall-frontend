import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role } from '../shared/interfaces/role';

@Component({
  selector: 'app-employee-hierarchy-item',
  templateUrl: './employee-hierarchy-item.component.html',
  styleUrls: ['./employee-hierarchy-item.component.css']
})
export class EmployeeHierarchyItemComponent implements OnInit {

  @Input() node: Role | undefined = undefined;
  @Input() showPicture: boolean = false;

  @Output() roleClickedEvent = new EventEmitter<Role>();

  constructor() { }

  ngOnInit(): void {
  }

  roleClicked(role: Role | undefined) {
    this.roleClickedEvent.emit(role as Role);

    // (role as Role).hideChildren = !(role as Role).hideChildren
  }

}
