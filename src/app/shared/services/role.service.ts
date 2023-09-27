import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Role } from '../interfaces/role';
import { environment } from 'src/environments/environment';
import { EmployeesService } from './employees.service';
import { EmpPhotoCollectionService } from './emp-photo-collection.service';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private http: HttpClient,
    private employeesService: EmployeesService,
    private empPhotoCollectionService: EmpPhotoCollectionService
  ) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  } 

  private mapToRole(roleObj: any): Role {
    let role = roleObj['attributes'];

    // assign employee by using id
    if(role.employee.data) {
      this.employeesService.getById(role.employee.data.id)
          .subscribe(emp => (role as Role).employee = emp);
    }

    if(role.employee_photo_collection.data) {
      this.empPhotoCollectionService.getByPictureUrlsById(role.employee_photo_collection.data.id)
          .subscribe(coll => {
            (role as Role).employeePictures = coll;
            if(role.children.length == 0) {
              console.log('pushing ...');
              role.children.push({
                id: 'xxx',
                employee: undefined as any,
                isSelected: false,
                name: role.name + ' - children',
                substitution: false,
                superrole: role,
                hideChildren: false,
                children: [],
                depth: role.depth + 1,
                employeePictures: role.employeePictures,
                isPictureCollectionNode: true
              } as Role);
            }
            console.log('role: ', role);
          });
    }

    role.id = roleObj.id;
    return role;
  }

  private createRoleList(resObj: any) : Role[] {
    return resObj['data'].map((roleObj: any) => this.mapToRole(roleObj));
  }

  private populateChildren(currentRoleList: any[], completeRoleList: any[], currentDepth: number) {
    for (let i = 0; i < currentRoleList.length; i++) {
      const roleListItem = currentRoleList[i];
      
      if(roleListItem.subfunctions?.data.length != 0) {
        const children = (roleListItem.subfunctions.data as any[]).map(child => completeRoleList.find(e => e.id === child.id))
        
        this.populateChildren(children, completeRoleList, currentDepth + 1);

        (currentRoleList[i] as Role).children = children;
        children.forEach(child => {
          child.superrole = currentRoleList[i];
        });
      } else {
        (currentRoleList[i] as Role).children = [];
      }
      
      if(!currentRoleList[i].depth || currentRoleList[i].depth < currentDepth) currentRoleList[i].depth = currentDepth;
      
      currentRoleList[i].hideChildren = true;
    }
  }

  private createRoleTree(resObj: any) : Role[] {
    // build tree
    const roleList: Role[] = this.createRoleList(resObj);

    this.populateChildren(roleList, roleList, 1);

    // remove non-root nodes
    const roleTree = (roleList as any[]).filter(emp => emp.superfunction.data == null)

    return roleTree;
  }

  getRoleTree(): Observable<Array<Role>> {
    return this.http.get<any>(
      `${environment.server}/functions`, {params: { populate: '*' }})
      .pipe(
        map(res => this.createRoleTree(res)), 
        catchError(this.errorHandler)
      );
  }

  private FilterExpandableRoles(resObj: any) {
    const roleList: any[] = this.createRoleList(resObj);

    return roleList.filter(role => role.subfunctions.data.length != 0);
  }
}
