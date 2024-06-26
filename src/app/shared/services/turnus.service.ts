import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of} from 'rxjs';
import { Turnus } from '../interfaces/turnus';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TurnusService {

  constructor(
    private http: HttpClient
  ) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  }

  private getPictures(picturesData: any): {name: string, url: string, role: string}[] {
    return (picturesData as any[]).map(photoObj => {
      let filenameWithoutPrefix = (photoObj.attributes.name as string)
      if(filenameWithoutPrefix.startsWith('api_')) {
        filenameWithoutPrefix = filenameWithoutPrefix.split('api_')[1];
      }

      let role = "";
      if(filenameWithoutPrefix.startsWith("ZD-")) role = "Zivildienst";
      if(filenameWithoutPrefix.startsWith("FSJ-")) role = "FSJ";

      return {
        name: filenameWithoutPrefix.replace(photoObj.attributes.ext, "").replace('ZD-', "").replace('FSJ-', ''),
        url: environment.uploadUrl.concat(photoObj.attributes.url),
        role: role
      } as {name: string, url: string, role: string};
    });
  }

  private mapToTurnus(turnusObj: any): Turnus {
    let turnus = turnusObj['attributes'];

    if(turnus.pictures.data) {
      turnus.pictures = this.getPictures(turnus.pictures.data);
    }
    
    turnus.id = turnusObj.id;

    return turnus;
  }

  getLastTurnuses(): Observable<Array<Turnus>> {
    return this.http.get<any>(
      `${environment.server}/turnuses`, {
        params: { 
          populate: '*', 
          'sort[0]': 'year:desc', 
          'sort[1]': 'month:desc',
        }
      }).pipe(
        map(res => res['data'].map((zdObj: any) => this.mapToTurnus(zdObj)).filter((turnus: Turnus) => turnus.active !== false)),
        catchError(this.errorHandler)
      );
  }
}
