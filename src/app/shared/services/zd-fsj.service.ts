import { Injectable } from '@angular/core';
import { ZdFsjTurnus } from '../interfaces/zd-fsj-turnus';
import { Observable, catchError, first, firstValueFrom, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ZdFsj } from '../interfaces/zd-fsj';

@Injectable({
  providedIn: 'root'
})
export class ZdFsjService {

  constructor(
    private http: HttpClient
  ) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  }

  private mapToZdFsj(zdfsjObj: any): ZdFsj {
    let zdfsj = zdfsjObj['attributes'];
    if(zdfsj.picture.data) {
      zdfsj.pictureUrl = environment.uploadUrl.concat(zdfsj.picture.data?.attributes.url);
    }

    if(zdfsj.assignment == 'zd') {
      zdfsj.assignmentShow = 'Zivildienst';
    } else if(zdfsj.assignment == 'fsj') {
      zdfsj.assignmentShow = 'FSJ';
    }

    zdfsj.id = zdfsjObj.id;
    return zdfsj;
  }

  getZdFsjById(id: number): Observable<ZdFsj> {
    return this.http.get<any>(
      `${environment.server}/zd-fsjs/${id}`, {params: { populate: '*' }})
      .pipe(
        map(res => this.mapToZdFsj(res['data'])), 
        catchError(this.errorHandler)
      );
  }

  private mapToZdFsjTurnus(zdfsjTurnusObj: any): ZdFsj {
    let zdFsjTurnus = zdfsjTurnusObj['attributes'];

    zdFsjTurnus.zdFsjs = [];

    (zdFsjTurnus.zd_fsjs.data as any[]).forEach((zdFsjObj, idx) => {
      this.getZdFsjById(zdFsjObj.id).subscribe((zdFsj: ZdFsj) => zdFsjTurnus.zdFsjs[idx] = zdFsj);
    });

    zdFsjTurnus.id = zdfsjTurnusObj.id;
    return zdFsjTurnus;
  }

  getLastRotationsWithZdFsj(numberOfRotations: number): Observable<Array<ZdFsjTurnus>> {
    return this.http.get<any>(
      `${environment.server}/zd-fsj-turnuses`, {
        params: { 
          populate: '*', 
          'sort[0]': 'year:desc', 
          'sort[1]': 'month:desc',
          'pagination[start]': 0,
          'pagination[limit]': numberOfRotations
        }
      }).pipe(
        map(res => res['data'].map((zdObj: any) => this.mapToZdFsjTurnus(zdObj))), 
        catchError(this.errorHandler)
      );
  }
}
