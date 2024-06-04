import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, concatMap, forkJoin, map, mergeAll, mergeMap, of, switchMap, tap, toArray } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VolunteerRealm } from '../interfaces/volunteer-realm';
import { Volunteer } from '../interfaces/volunteer';

@Injectable({
  providedIn: 'root'
})
export class VolunteersService {

  constructor(
    private http: HttpClient
  ) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  }

  private mapToVolunteerRealm(vRealmObj: any): Observable<VolunteerRealm> {
    let volunteerRealm = vRealmObj['attributes'];

    // const tmpVolunteerData: any[] = volunteerRealm.volunteers.data;
    // (volunteerRealm.volunteers as Volunteer[]) = [];
    volunteerRealm.volunteersArray = [];

    volunteerRealm.id = vRealmObj.id;

    return of(volunteerRealm).pipe(
      mergeMap(
        realm => realm.volunteers.data.length == 0 ? 
          of(realm)
            .pipe(
              map(realm => {
                realm.volunteersArray = [];
                return realm;
              })
            ) 
          : 
          (forkJoin(
            (realm.volunteers.data as any[]).map((volunteerObj: any) => this.getVolunteerById(volunteerObj.id))
          ).pipe(
            map(volunteersArray => {
              realm.volunteersArray = volunteersArray;
              return realm;
            })
          ))
      )
    )
  }

  getVolunteerRealms(): Observable<Array<VolunteerRealm>> {
    return this.http.get<any>(
      `${environment.server}/volunteer-realms`, {
        params: { 
          populate: '*',
        }
      }).pipe(
        map(res => res['data']),
        mergeAll(),
        map(vRealmObj => this.mapToVolunteerRealm(vRealmObj)),
        concatMap(x => x), // sync parallel 'map'-requests to maintain order of realms
        toArray(),
        catchError(this.errorHandler)
      );
  }

  private mapToVolunteer(volunteerObj: any): Volunteer {
    let volunteer = volunteerObj['attributes'];
    if(volunteer.picture.data) {
      volunteer.pictureUrl = environment.uploadUrl.concat(volunteer.picture.data?.attributes.url);
    }

    volunteer.id = volunteerObj.id;
    return volunteer;
  }

  getVolunteerById(id: number): Observable<Volunteer> {
    return this.http.get<any>(
      `${environment.server}/volunteers/${id}`, {params: { populate: '*' }})
      .pipe(
        map(res => this.mapToVolunteer(res['data'])), 
        catchError(this.errorHandler)
      );
  }
  
}
