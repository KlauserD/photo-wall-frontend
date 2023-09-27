import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpPhotoCollectionService {

  constructor(private http: HttpClient) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  } 

  private mapToPictureUrls(photoCollection: any): {name: string, url: string}[] {
    if(photoCollection.pictures.data) {
      return (photoCollection.pictures.data as any[]).map(photoCollObj => {
        return {
          name: (photoCollObj.attributes.name as string).replace(photoCollObj.attributes.ext, ""),
          url: environment.uploadUrl.concat(photoCollObj.attributes.url)
        } as {name: string, url: string};
      });
    }

    return [];
  }

  getByPictureUrlsById(id: number): Observable<{name: string, url: string}[]> {
    return this.http.get<any>(
      `${environment.server}/employee-photo-collections/${id}`, {params: { populate: '*' }})
      .pipe(
        map(res => this.mapToPictureUrls(res['data']['attributes'])), 
        catchError(this.errorHandler)
      );
  }
}
