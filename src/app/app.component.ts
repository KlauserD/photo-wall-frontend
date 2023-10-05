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

  slider: KeenSliderInstance = {} as KeenSliderInstance;
  currentSlideNumber: number = 0;
  dotSlideIdxArray: number[] = [];

  photowallPages: PhotowallPage[] = [];
  
  slideShowingTimes: number[] = [];

  constructor(
    private pdfService: PdfService,
    private changeDetectionRef: ChangeDetectorRef,
    private timeScheduleService: TimeScheduleService
  ) {
    this.slideShowingTimes[0] = 15; // employee hierarchy
    this.slideShowingTimes[1] = 15; // ZD/FSJ

    this.pdfService.getPhotowallPages().subscribe(pwps => {
      this.photowallPages = pwps; // this.preparePdfDocArrays(pwp);
      setTimeout(() => this.slider.update(), 200);
      this.dotSlideIdxArray = Array(this.photowallPages.length + 2).fill(0).map((x, i) => i)

      pwps.forEach((pwp, i) => this.slideShowingTimes[i + 2] = pwp.showingTime); // photowall pages
    });

    this.timeScheduleService.timerExpired$.subscribe(() => this.moveToNextSlide());
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      loop: true,
      initial: this.currentSlideNumber,
      slides: {
        origin: "center",
      },
      created: () => this.timeScheduleService.SetPageTimer(this.slideShowingTimes[this.currentSlideNumber]),
      slideChanged: (s) => {
        this.currentSlideNumber = s.track?.details?.rel;
        this.timeScheduleService.SetPageTimer(this.slideShowingTimes[this.currentSlideNumber]);
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
    } else {
      this.timeScheduleService.ResetCurrentTimer();
    }
  }

  moveToPrevSlide() {
    this.slider.prev();
  }

  moveToNextSlide() {
    this.slider.next();
  }
}
