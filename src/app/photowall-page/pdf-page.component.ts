import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { PdfPageService } from '../shared/services/pdf-page.service';
import { PdfPage } from '../shared/interfaces/pdf-page';
import { PdfDocument } from '../shared/interfaces/pdf-document';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { TimeScheduleService } from '../shared/services/time-schedule.service';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-page',
  templateUrl: './pdf-page.component.html',
  styleUrls: [
    './pdf-page.component.css',
    "../../../node_modules/keen-slider/keen-slider.min.css"
  ]
})
export class PdfPageComponent implements OnInit, OnChanges {

  @Input() pdfPage: PdfPage = {} as PdfPage
  @Input() slideNumber: number = -1;
  @Input() currentSlideNumber: number = -2;

  @ViewChild('sliderPdfRef') sliderPdfRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;
  sliderPdf: KeenSliderInstance = {} as KeenSliderInstance;

  @ViewChildren(PdfViewerComponent)
  private pdfComponents: QueryList<PdfViewerComponent> = {} as QueryList<PdfViewerComponent>;

  pageNumbers: any = {};

  pdfTurnOverTimeout: ReturnType<typeof setTimeout> = {} as ReturnType<typeof setTimeout>;

  constructor(
    private timeScheduleService: TimeScheduleService
  ) { 
    timeScheduleService.pdfTurnover$.subscribe(() => this.sliderPdf.next());
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.sliderPdf = new KeenSlider(this.sliderPdfRef.nativeElement, {
      loop: false,
      slides: {
        perView: 3,
        origin: 'auto'
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes as any).currentSlideNumber && this.currentSlideNumber == this.slideNumber) {
      this.sliderPdf.moveToIdx(0);

      const pdfLength = this.pageNumbers[this.pdfPage.id].length + 1;

      if(pdfLength > (this.sliderPdf.options.slides as any).perView) {
        this.timeScheduleService.SetPdfTurnoverTimer(this.pdfPage.turnOverTime);
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.slideNumber === this.currentSlideNumber) {
      if(event.code === 'NumpadDivide') {
        this.sliderPdf.prev();
      } else if(event.code === 'NumpadMultiply') {
        this.sliderPdf.next();
      }
    }
  }

  ngOnDestroy() {
    if (this.sliderPdf) this.sliderPdf.destroy()
  }

  InitialPagesInitialized(event: any, pdfPage: PdfPage) {
    const pagesCount = event.source.pdfDocument._pdfInfo.numPages;

    const viewbox: number[] = event.source._pages[0].viewport.viewBox; // [x, y, width, height]

    let pagesPerView = pagesCount >= 3 ? 3 : pagesCount;

    // landscape or normal format ?
    if(viewbox[2] > viewbox[3]) {
      pagesPerView = 1;
    }

    (this.sliderPdf.options.slides as any).perView = pagesPerView;

    if(pagesCount > pagesPerView) {
      this.sliderPdf.options.loop = true;
    }

    this.pageNumbers[pdfPage.id] = Array(pagesCount - 1).fill(0).map((x, i) => i + 2);

    this.sliderPdf.update();
  }

  RestPagesInitialized() {
    window.dispatchEvent(new Event('resize'))
    this.pdfComponents.forEach(pdfComp => pdfComp.pdfViewer.update());
    
    this.sliderPdf.update();
  }
}
