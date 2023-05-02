import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
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

    pdfDoc.fileUrl = pdfDoc.file.data.attributes.url;

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

  private mapToPhotowallPage(photowallPageObj: any): PhotowallPage {
    let photowallPage = photowallPageObj['attributes'];

    console.log(photowallPage);

    photowallPage.pdfDocuments = photowallPage.pdf_documents.data ?? [];

    (photowallPage.pdfDocuments as any[]).forEach((pdfDoc, idx) => {
      this.getPdfDocumentById(pdfDoc.id).subscribe((pdfDoc: PdfDocument) => photowallPage.pdfDocuments[idx] = pdfDoc);
    });

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
        map(res => res['data'].map((zdObj: any) => this.mapToPhotowallPage(zdObj))), 
        catchError(this.errorHandler)
      );
  }
}
