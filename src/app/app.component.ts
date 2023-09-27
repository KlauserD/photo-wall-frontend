import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { PhotowallPage } from './shared/interfaces/photowall-page';
import { PdfService } from './shared/services/pdf.service';
import { PdfDocument } from './shared/interfaces/pdf-document';
import { TimeScheduleService } from './shared/services/time-schedule.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
    "../../node_modules/keen-slider/keen-slider.min.css"
  ]
})
export class AppComponent {
  title = 'photo-wall-frontend';

  @ViewChild("sliderRef") sliderRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;

  currentSlideNumber: number = 0;
  dotHelper: Array<Number> = [];
  slider: KeenSliderInstance = {} as KeenSliderInstance;

  photowallPages: PhotowallPage[] = [];

  slideCountArray: number[] = [];

  constructor(
    private pdfService: PdfService,
    private changeDetectionRef: ChangeDetectorRef,
    private timeScheduleService: TimeScheduleService
  ) {
    this.pdfService.getPhotowallPages().subscribe(pwp => {
      this.photowallPages = this.preparePdfDocArrays(pwp);
      setTimeout(() => this.slider.update(), 200);
      this.slideCountArray = Array(this.photowallPages.length + 2).fill(0).map((x, i) => i)

      this.timeScheduleService.SetPageTimer(10);
    });
  }

  ngOnInit(): void {
    
  }

  private preparePdfDocArrays(photowallPages: PhotowallPage[]): PhotowallPage[] {
    photowallPages.forEach(pwp => {
      const pdfsPerPage = 3;

      let tmpPdfCount = 0;

      // init 
      let newPdfDocArray: PdfDocument[][] = [];
      for (let i = 0; i < Math.ceil(pwp.pdfDocuments.length / pdfsPerPage); i++) {
        newPdfDocArray[i] = [];
      }

      // fill
      for (let i = 0; i < pwp.pdfDocuments.length; i++) {
        const pdfDoc = pwp.pdfDocuments[i];

        newPdfDocArray[Math.floor(i / pdfsPerPage)][tmpPdfCount] = pdfDoc;
        tmpPdfCount = (tmpPdfCount + 1) % pdfsPerPage;
      }
      pwp.preparedPdfDocuments = newPdfDocArray;
    })
    return photowallPages;
  }

  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      loop: true,
      initial: this.currentSlideNumber,
      slides: {
        origin: "center",
      },
      slideChanged: (s) => {
        this.currentSlideNumber = s.track?.details?.rel;
      },
      selector: ".first > .keen-slider__slide"
    });
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy()
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.key === 'ArrowLeft') {
      this.moveToPrevSlide();
    } else if(event.key === 'ArrowRight') {
      this.moveToNextSlide();
    }
  }

  moveToPrevSlide() {
    this.slider.prev();
    this.timeScheduleService.SetPageTimer(10);
  }

  moveToNextSlide() {
    this.slider.next();
    this.timeScheduleService.SetPageTimer(10);
  }
}
