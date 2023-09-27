import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Employee } from '../shared/interfaces/employee';
import { EmployeesService } from '../shared/services/employees.service';
import { Role } from '../shared/interfaces/role';
import { RoleService } from '../shared/services/role.service';
import { ChildActivationEnd } from '@angular/router';
import { TimeScheduleService } from '../shared/services/time-schedule.service';

@Component({
  selector: 'app-employee-hierarchy',
  templateUrl: './employee-hierarchy.component.html',
  styleUrls: ['./employee-hierarchy.component.css']
})
export class EmployeeHierarchyComponent implements OnInit {

  private NOT_TOUCHED_TIMEOUT = 5000;
  private SELECT_NEXT_NODE_TIMEOUT = 3000;

  @Input() slideNumber: number = -1;
  @Input() currentSlideNumber: number = -2;

  // employees: Employee[] = [];
  roleTreeRoots: Role[] = [];

  selectedRolesWithOriginalSiblings: {role: Role, originalSiblings: Role[]}[] = [];
  selectNextTimeout: ReturnType<typeof setTimeout> = {} as ReturnType<typeof setTimeout>;

  // for selecting parent before selecting a sibling
  memorisedNextRole: Role | undefined;

  constructor(
    private roleService: RoleService,
    private timeScheduleService: TimeScheduleService
  ) { }

  ngOnInit(): void {
    this.roleService.getRoleTree().subscribe(roles => {
      this.roleTreeRoots = roles;
      roles.forEach(role => this.SelectRole(role)); // select roots
    });
    
    this.ResetNotTouchedTimeout();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.currentSlideNumber === this.slideNumber && event.key === 'ArrowDown') {
      this.SelectNextRole();
      this.timeScheduleService.SetPageTimer(20);
    }
  }

  ResetNotTouchedTimeout() {
    this.StopTimeout();
    console.log('starting not touched timeout');
    // this.selectNextTimeout = setTimeout(() => this.SelectNextRole(), this.NOT_TOUCHED_TIMEOUT);
  }

  ResetNextNodeTimeout() {
    this.StopTimeout();
    console.log('starting next node timeout');
    // this.selectNextTimeout = setTimeout(() => this.SelectNextRole(), this.SELECT_NEXT_NODE_TIMEOUT);
  }

  StopTimeout() {
    console.log('stopping timeout');
    clearTimeout(this.selectNextTimeout);
  }

  SelectNextRole() {
    let currSelectedRole = this.selectedRolesWithOriginalSiblings[this.selectedRolesWithOriginalSiblings.length - 1]?.role;
    let nextRole = this.memorisedNextRole ??
      this.FindNextExpandableNode(this.roleTreeRoots[0], currSelectedRole, {b: false});
    
    if(nextRole == undefined) nextRole = this.roleTreeRoots[0];

    if(currSelectedRole && nextRole.depth <= currSelectedRole.depth) {
      this.memorisedNextRole = nextRole;
      nextRole = currSelectedRole.superrole;
    }

    if(nextRole == this.memorisedNextRole) {
      this.memorisedNextRole = undefined;
    }

    if(!nextRole) {
      this.StopTimeout();
    } else {
      this.DoSelectRole(nextRole);
      this.ResetNextNodeTimeout();
    }
  }

  FindNextExpandableNode(parent: Role, current: Role, foundCurr: {b: boolean}): Role | undefined {
    if(foundCurr.b && parent.children.length != 0)  return parent;
    
    if(current == parent) {
      foundCurr.b = true;
    }

    if(parent.children.length != 0) {
      let children = this.selectedRolesWithOriginalSiblings
        .find(rws => rws.role.superrole == parent)
        ?.originalSiblings
        ?? parent.children;

      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let res = this.FindNextExpandableNode(child, current, foundCurr);
        if(res != undefined) return res;
      }
    }
    return undefined;
  }

  SelectRole(selectedRole: Role) {
    this.ResetNotTouchedTimeout();
    this.DoSelectRole(selectedRole);
  }

  DoSelectRole(selectedRole: Role) {
    if(selectedRole.children.length == 0) return; // no action when no children to display

    let currSelectedRole = this.selectedRolesWithOriginalSiblings[this.selectedRolesWithOriginalSiblings.length - 1]?.role;

    if(this.selectedRolesWithOriginalSiblings.length > 0 &&
        selectedRole == currSelectedRole) { // clicked on currently selected role
      if(selectedRole.superrole) {
        this.DoSelectRole(selectedRole.superrole);
      }
    } else {
      if(currSelectedRole?.isSelected) {
        currSelectedRole.isSelected = false;
        currSelectedRole.cssClass = 'normal-node';

        while(currSelectedRole && this.IsDescendent(currSelectedRole, selectedRole)) {

          const selectedRoleWithSiblings = (this.selectedRolesWithOriginalSiblings.pop() as {role: Role, originalSiblings: Role[]});
          this.GiveBackSiblings(selectedRoleWithSiblings.role, selectedRoleWithSiblings.originalSiblings);

          currSelectedRole = this.selectedRolesWithOriginalSiblings[this.selectedRolesWithOriginalSiblings.length - 1]?.role;
        }
      }
      selectedRole.isSelected = true;
      selectedRole.cssClass = 'color-node';

      this.HideAllDescendants(selectedRole);
      const originialSiblings = this.HideAllSiblings(selectedRole);

      this.selectedRolesWithOriginalSiblings.push({role: selectedRole, originalSiblings: originialSiblings});
  
      selectedRole.hideChildren = false;
    }
  }

  IsDescendent(questionableDescendant: Role, role: Role): boolean {
    let currentRole: Role;
    currentRole = questionableDescendant.superrole;

    while(currentRole) { // not undefined
      if(currentRole == role) return true;

      currentRole = currentRole.superrole;
    }
    return false;
  }

  // returns stolen siblings
  HideAllSiblings(role: Role): Role[] {
    if(role.superrole) { // parent exists?
      role.superrole.children.forEach(child => {
        this.HideAllDescendants(child);
        // if(child != role) {
        //   this.stolenSiblingRoles.push(child);
        // }
      });

      const originalSiblings = [...role.superrole.children];

      role.superrole.children = [role];

      return originalSiblings;
    }
    return [];
  }

  GiveBackSiblings(role: Role, siblings: Role[]) {
    if(siblings.length != 0 &&
        role.superrole
      ) {
        role.superrole.children = [...siblings];
      }
  }

  HideAllDescendants(role: Role) {
    if(!role.isPictureCollectionNode) {
      if(role.children.length != 0) {
        role.children.forEach(child => this.HideAllDescendants(child));
      }
      role.hideChildren = true;
    }
    
  }

}
