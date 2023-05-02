import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private http: HttpClient) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  } 

  private mapToEmployee(empObj: any): Employee {
    let employee = empObj['attributes'];
    if(employee.picture.data) {
      employee.pictureUrl = environment.uploadUrl.concat(employee.picture.data?.attributes.url);
    }

    employee.qualification = employee.qualification.data?.attributes.name;

    employee.id = empObj.id;
    return employee;
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<any>(
      `${environment.server}/employees/${id}`, {params: { populate: '*' }})
      .pipe(
        map(res => this.mapToEmployee(res['data'])), 
        catchError(this.errorHandler)
      );
  }
}
