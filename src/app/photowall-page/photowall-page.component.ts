import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { PdfService } from '../shared/services/pdf.service';
import { PhotowallPage } from '../shared/interfaces/photowall-page';
import { PdfDocument } from '../shared/interfaces/pdf-document';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { TimeScheduleService } from '../shared/services/time-schedule.service';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-photowall-page',
  templateUrl: './photowall-page.component.html',
  styleUrls: [
    './photowall-page.component.css',
    "../../../node_modules/keen-slider/keen-slider.min.css"
  ]
})
export class PhotowallPageComponent implements OnInit, OnChanges {

  @Input() photowallPage: PhotowallPage = {} as PhotowallPage
  @Input() slideNumber: number = -1;
  @Input() currentSlideNumber: number = -2;

  @ViewChild("sliderPdfRef") sliderPdfRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;
  sliderPdf: KeenSliderInstance = {} as KeenSliderInstance;

  @ViewChildren(PdfViewerComponent)
  private pdfComponents: QueryList<PdfViewerComponent> = {} as QueryList<PdfViewerComponent>;

  pageNumbers: any = {};

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

    // setTimeout(() => console.log(this.pdfComponents), 6000);
    // this.pdfComponent.pdfViewer.currentScaleValue = 'page-fit';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes as any).currentSlideNumber && this.currentSlideNumber == this.slideNumber) {
      this.sliderPdf.moveToIdx(0);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.slideNumber === this.currentSlideNumber && event.key === 'ArrowDown') {
      this.sliderPdf.next();
    }
  }

  ngOnDestroy() {
    if (this.sliderPdf) this.sliderPdf.destroy()
  }

  InitialPagesInitialized(event: any, photowallPage: PhotowallPage) {
    const pageNumber = event.source.pdfDocument._pdfInfo.numPages;

    if(pageNumber <= 3) this.sliderPdf.options.loop = false;

    this.pageNumbers[photowallPage.id] = Array(pageNumber - 1).fill(0).map((x, i) => i + 2);
  }

  RestPagesInitialized() {
    this.sliderPdf.update();
    window.dispatchEvent(new Event('resize'))
    this.pdfComponents.forEach(pdfComp => pdfComp.pdfViewer.update());
  }

}
