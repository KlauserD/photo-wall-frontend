import { PdfDocument } from "./pdf-document"

export interface PhotowallPage {
    id: string,
    title: string,
    pdfDocumentUrl: string,
    showingTime: number
}