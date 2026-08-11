import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { PdfPage } from '../shared/interfaces/pdf-page';
import { PdfPageService } from '../shared/services/pdf-page.service';
import { TimeScheduleService } from '../shared/services/time-schedule.service';
import { RefreshTimeService } from '../shared/services/refresh-time.service';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: [
    './garage.component.css',
    "../../../node_modules/keen-slider/keen-slider.min.css"
  ]
})
export class GarageComponent implements OnInit {

  readonly FIXED_SLIDES_COUNT = 0;

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
    private timeScheduleService: TimeScheduleService,
    private refreshTimeService: RefreshTimeService
  ) { 
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

  ngOnInit(): void {
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

  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      loop: true,
      initial: this.currentSlideNumber,
      slides: {
        origin: "center",
      },
      created: () => this.timeScheduleService.SetSlideTimer(this.slideDetails[this.currentSlideNumber]?.showingTime),
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
    if(event.code === 'ArrowLeft' || event.code === 'NumLock') {
      this.SlideManuallyChanged();
      this.slider.prev();
    } else if(event.code === 'ArrowRight' || event.code === 'NumpadSubtract') {
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

  moveToNextSlide() {
    this.slider.next();
  }
}
