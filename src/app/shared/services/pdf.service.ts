import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PhotowallPage } from '../interfaces/photowall-page';
import { PdfDocument } from '../interfaces/pdf-document';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(
    private http: HttpClient
  ) { }

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  }

  private mapToPdfDocument(pdfDocObj: any): PdfDocument {
    let pdfDoc = pdfDocObj['attributes'];

    pdfDoc.fileUrl = environment.uploadUrl.concat(pdfDoc.file.data.attributes.url);

    pdfDoc.id = pdfDocObj.id;

    return pdfDoc;
  }

  getPdfDocumentById(id: number): Observable<PdfDocument> {
    return this.http.get<any>(
      `${environment.server}/pdf-documents/${id}`, {params: { populate: '*' }})
      .pipe(
        map(res => this.mapToPdfDocument(res['data'])), 
        catchError(this.errorHandler)
      );
  }

  private async mapToPhotowallPage(photowallPageObj: any): Promise<PhotowallPage> {
    let photowallPage = photowallPageObj['attributes'];

    photowallPage.pdfDocuments = photowallPage.pdf_documents.data ?? [];

    for (let i = 0; i < (photowallPage.pdfDocuments as any[]).length; i++) {
      const pdfDoc = (photowallPage.pdfDocuments as any[])[i];
      
      (photowallPage.pdfDocuments as any[])[i] = await firstValueFrom(this.getPdfDocumentById(pdfDoc.id));
    }

    photowallPage.id = photowallPageObj.id;
    return photowallPage;
  }

  getPhotowallPages(): Observable<Array<PhotowallPage>> {
    return this.http.get<any>(
      `${environment.server}/photowall-pages`, {
        params: { 
          populate: '*'
        }
      }).pipe(
        map(res => res['data']),
        switchMap(data => Promise.all(data.map(async (zdObj: any) => await this.mapToPhotowallPage(zdObj)))),
        catchError(this.errorHandler)
      );
  }
}
