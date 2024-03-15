import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { PdfPage } from './shared/interfaces/pdf-page';
import { PdfPageService } from './shared/services/pdf-page.service';
import { PdfDocument } from './shared/interfaces/pdf-document';
import { TimeScheduleService } from './shared/services/time-schedule.service';
import { SingleTypesService } from './shared/services/single-types.service';
import { DynamicUpdateService } from './shared/services/dynamic-update.service';
import { RefreshTimeService } from './shared/services/refresh-time.service';

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

  readonly FIXED_SLIDES_COUNT = 3;

  @ViewChild("sliderRef") sliderRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;

  slider: KeenSliderInstance = {} as KeenSliderInstance;
  currentSlideNumber: number = 0;
  dotSlideIdxArray: number[] = [];

  pdfPages: PdfPage[] = [];
  
  slideDetails: {title: string, showingTime: number}[] = [];

  showNavbar: boolean = false;
  showPauseSymbol: boolean = false;

  constructor(
    private pdfService: PdfPageService,
    private changeDetectionRef: ChangeDetectorRef,
    private timeScheduleService: TimeScheduleService,
    private singleTypesService: SingleTypesService,
    private refreshTimeService: RefreshTimeService,
    private dynUpdate: DynamicUpdateService
  ) {
    // default values
    this.slideDetails[0] = {title: 'Organigramm', showingTime: 20}; // employee hierarchy
    this.slideDetails[1] = {title: 'ZD/FSJ-Turnus', showingTime: 20}; // ZD/FSJ
    this.slideDetails[2] = {title: 'PV Anlage', showingTime: 15}; // Fronius

    singleTypesService.getHierarchyShowingTime().subscribe(seconds => { if(seconds != null) this.slideDetails[0].showingTime = seconds; });
    singleTypesService.getZdFsjShowingTime().subscribe(seconds => { if(seconds != null) this.slideDetails[1].showingTime = seconds; });

    this.pdfService.getPdfPages().subscribe(pwps => {
      this.pdfPages = pwps; // this.preparePdfDocArrays(pwp);
      setTimeout(() => this.slider.update(), 200);
      this.dotSlideIdxArray = Array(this.pdfPages.length + this.FIXED_SLIDES_COUNT).fill(0).map((x, i) => i)

      pwps.forEach((pwp, i) => this.slideDetails[i + this.FIXED_SLIDES_COUNT] = {title: pwp.title, showingTime: pwp.totalShowingTime}); // photowall pages
    });

    this.timeScheduleService.slideTimerExpired$.subscribe(() => this.moveToNextSlide());

    this.timeScheduleService.showNavbar$.subscribe(show => this.showNavbar = show);
    this.timeScheduleService.animationStopped$.subscribe(stopped => this.showPauseSymbol = stopped);
  
    this.refreshTimeService.getRefreshTimes().subscribe(times => times.forEach(time => this.refreshAt(time)));
  }

  private refreshAt(refreshTime: Date) {
    const hours = refreshTime.getHours();
    const minutes = refreshTime.getMinutes();
    const seconds = refreshTime.getSeconds();

    var now = new Date();
    var then = new Date();

    if(now.getHours() > hours ||
       (now.getHours() == hours && now.getMinutes() > minutes) ||
        now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
        then.setDate(now.getDate() + 1);
    }
    then.setHours(hours);
    then.setMinutes(minutes);
    then.setSeconds(seconds);

    var timeout = (then.getTime() - now.getTime());
    setTimeout(() => window.location.reload(), timeout);
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
      created: () => this.timeScheduleService.SetSlideTimer(this.slideDetails[this.currentSlideNumber].showingTime),
      slideChanged: (s) => {
        this.currentSlideNumber = s.track?.details?.rel;
        this.timeScheduleService.SetSlideTimer(this.slideDetails[this.currentSlideNumber].showingTime);
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
      this.SlideManuallyChanged();
      this.moveToPrevSlide();
    } else if(event.key === 'ArrowRight') {
      this.SlideManuallyChanged();
      this.moveToNextSlide();
    } else {
      this.timeScheduleService.StopAllTimersForSeconds(10);
    }
  }

  private SlideManuallyChanged() {
    this.timeScheduleService.ShowNavbarForSeconds(5);
    this.timeScheduleService.StopAllTimersForSeconds(5);
  }

  moveToPrevSlide() {
    this.slider.prev();
  }

  moveToNextSlide() {
    this.slider.next();
  }
}
