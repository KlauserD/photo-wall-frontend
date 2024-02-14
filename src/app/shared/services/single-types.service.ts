import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SingleTypesService {
  
  constructor(private http: HttpClient) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  }

  getHierarchyShowingTime(): Observable<number> {
    return this.http.get<any>(
      `${environment.server}/hierarchy-showing-time`)
      .pipe(
        map(res => res['data']['attributes']['seconds']), 
        catchError(this.errorHandler)
      );
  }

  getZdFsjShowingTime(): Observable<number> {
    return this.http.get<any>(
      `${environment.server}/zd-fsj-showing-time`)
      .pipe(
        map(res => res['data']['attributes']['seconds']), 
        catchError(this.errorHandler)
      );
  }
}
