import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { Function } from '../interfaces/function';
import { environment } from 'src/environments/environment';
import { EmployeesService } from './employees.service';
import { EmpPhotoCollectionService } from './emp-photo-collection.service';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class FunctionTreeService {

  private functionTreeSubject$: Subject<Function[]> = new Subject<Function[]>();
  public functionTree$: Observable<Function[]>;

  constructor(
    private http: HttpClient,
    private employeesService: EmployeesService,
    private empPhotoCollectionService: EmpPhotoCollectionService
  ) { 
    this.functionTree$ = this.functionTreeSubject$.asObservable();
  }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  } 

  private mapToFunction(functionObj: any): Function {
    let role = functionObj['attributes'];

    // assign employee by using id
    if(role.employee.data) {
      this.employeesService.getById(role.employee.data.id)
          .subscribe(emp => {
              // (role as Function).showPicture = true;
              (role as Function).employee = emp;
            
      });
    }

    if(role.employee_photo_collection.data) {
      this.empPhotoCollectionService.getByPictureUrlsById(role.employee_photo_collection.data.id)
          .subscribe(coll => {
            (role as Function).employeePictures = coll;
            if(role.children.length == 0) {
              role.children.push({
                id: 'xxx',
                employee: undefined as any,
                isSelected: false,
                name: role.name + ' - children',
                substitution: false,
                superrole: role,
                hideChildren: false,
                children: [],
                realChildren: [],
                depth: role.depth + 1,
                employeePictures: role.employeePictures,
                isPictureCollectionNode: true,
                selector: 0
              } as Function);
            }
          });
    }

    role.id = functionObj.id;
    return role;
  }

  private createFunctionList(resObj: any) : Function[] {
    return resObj['data'].map((roleObj: any) => this.mapToFunction(roleObj));
  }

  private populateChildren(currentRoleList: any[], completeRoleList: any[], currentDepth: number) {
    for (let i = 0; i < currentRoleList.length; i++) {
      const roleListItem = currentRoleList[i];
      
      if(roleListItem.subfunctions?.data.length != 0) {
        const children = (roleListItem.subfunctions.data as any[]).map(child => completeRoleList.find(e => e.id === child.id))
        
        this.populateChildren(children, completeRoleList, currentDepth + 1);

        (currentRoleList[i] as Function).children = children;
        children.forEach(child => {
          child.superrole = currentRoleList[i];
        });
      } else {
        (currentRoleList[i] as Function).children = [];
      }
      
      if(!currentRoleList[i].depth || currentRoleList[i].depth < currentDepth) {
        currentRoleList[i].depth = currentDepth;
      }

      currentRoleList[i].hideChildren = false;
    }
  }

  private createFunctionTree(resObj: any) : Function[] {
    // build tree
    const functionList: Function[] = this.createFunctionList(resObj);

    this.populateChildren(functionList, functionList, 1);

    // remove non-root nodes
    const functionTree = (functionList as any[]).filter(emp => emp.superfunction.data == null)

    return functionTree;
  }

  updateFunctionTree() {
    this.http.get<any>(
      `${environment.server}/functions`, {params: { populate: '*' }})
      .pipe(
        map(res => this.createFunctionTree(res)), 
        catchError(this.errorHandler)
      ).subscribe(tree => {
        if(tree != null) {
          this.functionTreeSubject$.next(tree);
        }
      });
  }

  // getFunctionTree(): Observable<Array<Function>> {
  //   return this.http.get<any>(
  //     `${environment.server}/functions`, {params: { populate: '*' }})
  //     .pipe(
  //       map(res => this.createFunctionTree(res)), 
  //       catchError(this.errorHandler)
  //     );
  // }
}
