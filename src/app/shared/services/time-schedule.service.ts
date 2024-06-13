import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeScheduleService {
  private INTERVAL_STEP = 500;

  public slideTimerExpired$: Observable<void>;
  private slideTimerExpiredSubject$: Subject<void> = new Subject<void>();

  public slideTimerPercentage$: Observable<number>;
  private slideTimerPercentageSubject$: Subject<number> = new Subject<number>();

  public pdfTurnover$: Observable<void>;
  private pdfTurnoverSubject$: Subject<void> = new Subject<void>();

  public showNavbar$: Observable<boolean>;
  private showNavbarSubject$: Subject<boolean> = new Subject<boolean>();

  public animationStopped$: Observable<boolean>;
  private animationStoppedSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // slide timer
  private slideTimer: any;
  private initialSlideTime: number = 0;
  private elapsedSlideTime: number = 0;

  // pdf turnover
  private turnoverTime: number = 5;
  private pdfTurnoverTimeout: ReturnType<typeof setTimeout> = {} as ReturnType<typeof setTimeout>;;


  private stopTimeout: ReturnType<typeof setTimeout> = {} as ReturnType<typeof setTimeout>;
  private showNavbarTimeout: ReturnType<typeof setTimeout> = {} as ReturnType<typeof setTimeout>;

  constructor() {
    // this.pageTimerReset$ = this.pageTimerResetSubject$.asObservable();
    this.slideTimerPercentage$ = this.slideTimerPercentageSubject$.asObservable();
    this.slideTimerExpired$ = this.slideTimerExpiredSubject$.asObservable();
    this.pdfTurnover$ = this.pdfTurnoverSubject$.asObservable();
    this.showNavbar$ = this.showNavbarSubject$.asObservable();
    this.animationStopped$ = this.animationStoppedSubject$.asObservable();
  }

  /* all timers */

  public StopAllTimersForSeconds(seconds: number) {
    clearTimeout(this.stopTimeout);

    this.ResetCurrentSlideTimer();
    this.StopSlideTimer();
    this.StopPdfTurnover();

    this.stopTimeout = setTimeout(() => {
      this.StartSlideTimer();
      this.SetPdfTurnoverTimer(this.turnoverTime);
    }, seconds * 1000);
  }

  /* navbar */

  public ShowNavbarForSeconds(seconds: number) {
    clearTimeout(this.showNavbarTimeout);

    this.showNavbarSubject$.next(true);

    this.showNavbarTimeout = setTimeout(() => this.showNavbarSubject$.next(false), seconds * 1000);
  }

  /* pdf turnover */

  public StopPdfTurnover() {
    clearTimeout(this.pdfTurnoverTimeout);
  }

  public SetPdfTurnoverTimer(seconds: number) {
    this.turnoverTime = seconds;
    clearTimeout(this.pdfTurnoverTimeout);
    this.pdfTurnoverTimeout = setTimeout(() => this.pdfTurnoverCallback(seconds), seconds * 1000);
  }

  private pdfTurnoverCallback(seconds: number) {
    this.pdfTurnoverSubject$.next();
    this.pdfTurnoverTimeout = setTimeout(() => this.pdfTurnoverCallback(seconds), seconds * 1000);
  }

  /* slide timer */

  public SetSlideTimer(seconds: number) {
    this.initialSlideTime = seconds * 1000;

    if(this.slideTimer?.cancel) {
      this.slideTimer.cancel();
    }

    this.slideTimerPercentageSubject$.next(100);
    this.elapsedSlideTime = 0;

    if(!this.animationStoppedSubject$.getValue()) {
      this.StartSlideTimer();
    }
  }

  public ResetCurrentSlideTimer() {
    this.SetSlideTimer(this.initialSlideTime / 1000);
  }

  private StopSlideTimer() {
    if(this.slideTimer?.cancel) {
      this.slideTimer.cancel();
    }

    this.animationStoppedSubject$.next(true);
  }

  private StartSlideTimer() {
    this.animationStoppedSubject$.next(false);
    this.slideTimer = this.accurateTimer(() => this.slideTimerIntervalCallback(), this.INTERVAL_STEP);
  }

  private slideTimerIntervalCallback() {
    this.elapsedSlideTime += this.INTERVAL_STEP;

    if(this.elapsedSlideTime > this.initialSlideTime) {
      this.elapsedSlideTime = this.initialSlideTime;
      clearInterval(this.slideTimer);
      this.slideTimerExpiredSubject$.next();
    }

    this.slideTimerPercentageSubject$.next(100 - (this.elapsedSlideTime / this.initialSlideTime) * 100);
  }

  private accurateTimer = (fn: () => void, time: number) => {
    // nextAt is the value for the next time the timer should fire.
    // timeout holds the timeoutID so the timer can be stopped.
    let nextAt: number, timeout: ReturnType<typeof setTimeout>;
    // Initilzes nextAt as now + the time in milliseconds you pass
    // to accurateTimer.
    nextAt = new Date().getTime() + time;
   
    // This function schedules the next function call.
    const wrapper = () => {
      // The next function call is always calculated from when the
      // timer started.
      nextAt += time;
      // this is where the next setTimeout is adjusted to keep the
      //time accurate.
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      // the function passed to accurateTimer is called.
      fn();
    };
   
    // this function stops the timer.
    const cancel = () => clearTimeout(timeout);
   
    // the first function call is scheduled.
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
   
    // the cancel function is returned so it can be called outside
    // accurateTimer.
    return { cancel };
  };
}
