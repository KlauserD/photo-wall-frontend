import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PdfPage } from '../interfaces/pdf-page';
import { PdfDocument } from '../interfaces/pdf-document';

@Injectable({
  providedIn: 'root'
})
export class PdfPageService {

  constructor(
    private http: HttpClient
  ) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  }

  private async mapToPdfPage(pdfPageObj: any): Promise<PdfPage> {
    let pdfPage = pdfPageObj['attributes'];

    pdfPage.pdfDocumentUrl = environment.uploadUrl.concat(pdfPage.document.data.attributes.url);
    pdfPage.id = pdfPageObj.id;

    return pdfPage;
  }

  getPdfPages(): Observable<Array<PdfPage>> {
    return this.http.get<any>(
      `${environment.server}/pdf-pages`, {
        params: { 
          populate: '*'
        }
      }).pipe(
        map(res => res['data']),
        switchMap(data => Promise.all(data.map(async (zdObj: any) => await this.mapToPdfPage(zdObj)))),
        catchError(this.errorHandler)
      );
  }
}
