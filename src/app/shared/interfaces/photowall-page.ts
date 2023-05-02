import { PdfDocument } from "./pdf-document"

export interface PhotowallPage {
    id: string,
    title: string,
    pdfDocuments: PdfDocument[],

    // computed for showing X pdfs per page
    preparedPdfDocuments: PdfDocument[][]
}