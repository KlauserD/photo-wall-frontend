import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { PdfService } from '../shared/services/pdf.service';
import { PhotowallPage } from '../shared/interfaces/photowall-page';
import { PdfDocument } from '../shared/interfaces/pdf-document';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { TimeScheduleService } from '../shared/services/time-schedule.service';

@Component({
  selector: 'app-photowall-page',
  templateUrl: './photowall-page.component.html',
  styleUrls: [
    './photowall-page.component.css',
    "../../../node_modules/keen-slider/keen-slider.min.css"
  ]
})
export class PhotowallPageComponent implements OnInit {

  @Input() photowallPage: PhotowallPage = {} as PhotowallPage
  // @Input() slider: KeenSliderInstance = {} as KeenSliderInstance;
  @Input() slideNumber: number = -1;
  @Input() currentSlideNumber: number = -2;

  @ViewChild("sliderPdfRef") sliderPdfRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;
  sliderPdf: KeenSliderInstance = {} as KeenSliderInstance;

  // @ViewChild("sliderPdfPagesRef") sliderPdfPagesRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;
  // sliderPdfPages: KeenSliderInstance = {} as KeenSliderInstance;

  pageNumbers: any = {};

  showInitialPdf: boolean = true;

  constructor(
    private timeScheduleService: TimeScheduleService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.sliderPdf = new KeenSlider(this.sliderPdfRef.nativeElement, {
      loop: true,
      slides: {
        perView: 3,
      }
    });

    setTimeout(() => this.sliderPdf.update(), 5000);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.slideNumber === this.currentSlideNumber && event.key === 'ArrowDown') {
      this.sliderPdf.next();
      this.timeScheduleService.SetPageTimer(20);
    }
  }

  ngOnDestroy() {
    if (this.sliderPdf) this.sliderPdf.destroy()
  }

  InitialPagesInitialized(event: any, pdfDoc: PdfDocument) {
    const pageNumber = event.source.pdfDocument._pdfInfo.numPages;

    this.pageNumbers[pdfDoc.id] = Array(pageNumber).fill(0).map((x, i) => i + 1);
  }

  RestPagesInitialized() {
    this.showInitialPdf = false;
  }

}
