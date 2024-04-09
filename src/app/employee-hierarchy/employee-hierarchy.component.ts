import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Employee } from '../shared/interfaces/employee';
import { EmployeesService } from '../shared/services/employees.service';
import { Function } from '../shared/interfaces/function';
import { FunctionTreeService } from '../shared/services/function-tree.service';
import { ChildActivationEnd } from '@angular/router';
import { TimeScheduleService } from '../shared/services/time-schedule.service';

@Component({
  selector: 'app-employee-hierarchy',
  templateUrl: './employee-hierarchy.component.html',
  styleUrls: ['./employee-hierarchy.component.css']
})
export class EmployeeHierarchyComponent implements OnInit, OnChanges {

  // private NOT_TOUCHED_TIMEOUT = 5000;
  // private SELECT_NEXT_NODE_TIMEOUT = 3000;

  @Input() slideNumber: number = -1;
  @Input() currentSlideNumber: number = -2;

  selectorInput: string = "";
  selectorInputResetTimeout: ReturnType<typeof setTimeout> = {} as ReturnType<typeof setTimeout>;

  // employees: Employee[] = [];
  functionTreeRoots: Function[] = [];

  selectedRolesWithOriginalSiblings: {role: Function, originalSiblings: Function[]}[] = [];
  // selectNextTimeout: ReturnType<typeof setTimeout> = {} as ReturnType<typeof setTimeout>;

  // for selecting parent before selecting a sibling
  // memorisedNextRole: Role | undefined;

  constructor(
    private timeScheduleService: TimeScheduleService,
    private functionService: FunctionTreeService
  ) { }

  ngOnInit(): void {
    this.functionService.functionTree$.subscribe(treeRoots => {
      this.functionTreeRoots = treeRoots;
      treeRoots.forEach(tree => {
        this.DoSelectRole(tree);
        
        this.AssignSelectorNumbers(tree);
      }); // select roots
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes as any).currentSlideNumber && this.currentSlideNumber == this.slideNumber) {
      this.functionTreeRoots.forEach(role => this.DoSelectRole(role)); // select roots
    }
  }

  private AssignSelectorNumbers(roleTree: Function) {
    const currentNumberWrapper = { currentNumber: 1 };

    // assign root
    if(roleTree.children.length > 0 || (roleTree as any).employee_photo_collection.data) roleTree.selector = currentNumberWrapper.currentNumber++;

    this.RecAssignSelectorNumbers(roleTree, currentNumberWrapper);
  }

  private RecAssignSelectorNumbers(roleTree: Function, currentNumberWrapper: { currentNumber: number }) {
    roleTree.children.forEach(role => {
      if(role.children.length > 0 || (role as any).employee_photo_collection.data) role.selector = currentNumberWrapper.currentNumber++;
    })

    roleTree.children.forEach(role => this.RecAssignSelectorNumbers(role, currentNumberWrapper));
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.currentSlideNumber == this.slideNumber) {
      if((event.key >= '0' && event.key <= '9') || 
         (event.code >= 'Numpad0' && event.code <= 'Numpad9')) {
        
        clearTimeout(this.selectorInputResetTimeout);
        this.selectorInputResetTimeout = setTimeout(() => this.selectorInput = "", 5000);

        if(this.selectorInput.length >= 2) {
          this.selectorInput = "";
        }

        if(event.code >= 'Numpad0' && event.code <= 'Numpad9') {
          this.selectorInput += event.code.split('Numpad')[1];
        } else {
          this.selectorInput += event.key;
        }

        if(this.selectorInput.length == 2) {
          const selectedRole = this.FindRoleForSelector(+this.selectorInput);
          if(selectedRole != null) this.SelectRole(selectedRole);
        }
      } else if(event.key == 'Delete') {
        this.selectorInput = "";
      }
    }

    // if(this.currentSlideNumber === this.slideNumber && event.key === 'ArrowDown') {
    //   this.SelectNextRole();
    // }
  }

  // ResetNotTouchedTimeout() {
  //   this.StopTimeout();
  //   console.log('starting not touched timeout');
  //   // this.selectNextTimeout = setTimeout(() => this.SelectNextRole(), this.NOT_TOUCHED_TIMEOUT);
  // }

  // ResetNextNodeTimeout() {
  //   this.StopTimeout();
  //   console.log('starting next node timeout');
  //   // this.selectNextTimeout = setTimeout(() => this.SelectNextRole(), this.SELECT_NEXT_NODE_TIMEOUT);
  // }

  // StopTimeout() {
  //   console.log('stopping timeout');
  //   clearTimeout(this.selectNextTimeout);
  // }

  // SelectNextRole() {
  //   let currSelectedRole = this.selectedRolesWithOriginalSiblings[this.selectedRolesWithOriginalSiblings.length - 1]?.role;
  //   let nextRole = this.memorisedNextRole ??
  //     this.FindNextExpandableNode(this.roleTreeRoots[0], currSelectedRole, {b: false});
    
  //   if(nextRole == undefined) nextRole = this.roleTreeRoots[0];

  //   if(currSelectedRole && nextRole.depth <= currSelectedRole.depth) {
  //     this.memorisedNextRole = nextRole;
  //     nextRole = currSelectedRole.superrole;
  //   }

  //   if(nextRole == this.memorisedNextRole) {
  //     this.memorisedNextRole = undefined;
  //   }

  //   if(!nextRole) {
  //     this.StopTimeout();
  //   } else {
  //     this.DoSelectRole(nextRole);
  //     this.ResetNextNodeTimeout();
  //   }
  // }

  // FindNextExpandableNode(parent: Role, current: Role, foundCurr: {b: boolean}): Role | undefined {
  //   if(foundCurr.b && parent.children.length != 0)  return parent;
    
  //   if(current == parent) {
  //     foundCurr.b = true;
  //   }

  //   if(parent.children.length != 0) {
  //     let children = this.selectedRolesWithOriginalSiblings
  //       .find(rws => rws.role.superrole == parent)
  //       ?.originalSiblings
  //       ?? parent.children;

  //     for (let i = 0; i < children.length; i++) {
  //       let child = children[i];
  //       let res = this.FindNextExpandableNode(child, current, foundCurr);
  //       if(res != undefined) return res;
  //     }
  //   }
  //   return undefined;
  // }

  private FindRoleForSelector(selector: number): Function | null {
    return this.RecFindRoleForSelector(this.functionTreeRoots[0], selector);
  }

  private RecFindRoleForSelector(role: Function, selector: number): Function | null {
    if(role.selector == selector) return role;

    for (let i = 0; i < role.children.length; i++) {
      const child = role.children[i];
      const result = this.RecFindRoleForSelector(child, selector);
      if(result != null) return result;
    }

    return null;
  }

  SelectRole(selectedRole: Function) {
    this.timeScheduleService.StopAllTimersForSeconds(10);
    this.DoSelectRole(selectedRole);
  }

  DoSelectRole(selectedRole: Function) {
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

          const selectedRoleWithSiblings = (this.selectedRolesWithOriginalSiblings.pop() as {role: Function, originalSiblings: Function[]});
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

  IsDescendent(questionableDescendant: Function, role: Function): boolean {
    let currentRole: Function;
    currentRole = questionableDescendant.superrole;

    while(currentRole) { // not undefined
      if(currentRole == role) return true;

      currentRole = currentRole.superrole;
    }
    return false;
  }

  // returns stolen siblings
  HideAllSiblings(role: Function): Function[] {
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

  GiveBackSiblings(role: Function, siblings: Function[]) {
    if(siblings.length != 0 &&
        role.superrole
      ) {
        role.superrole.children = [...siblings];
      }
  }

  HideAllDescendants(role: Function) {
    if(!role.isPictureCollectionNode) {
      if(role.children.length != 0) {
        role.children.forEach(child => this.HideAllDescendants(child));
      }
      role.hideChildren = true;
    }
    
  }

}
