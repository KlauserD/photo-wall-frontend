import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RefreshTimeService {
  constructor(
    private http: HttpClient
  ) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  }

  private mapToDate(dateObj: any): Date {
    const dateString: string = dateObj['attributes']['timeOfDay'];
    const dateStringSplitted = dateString.split(':');
    const date = new Date(); // today
    date.setHours(+dateStringSplitted[0]);
    date.setMinutes(+dateStringSplitted[1]);
    date.setSeconds(0);

    return date;
  }

  getRefreshTimes(): Observable<Array<Date>> {
    return this.http.get<any>(
      `${environment.server}/refresh-times`
      ).pipe(
        map(res => res['data'].map((dateObj: any) => this.mapToDate(dateObj))),
        catchError(this.errorHandler)
      );
  }
}
