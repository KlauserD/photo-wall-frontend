import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeScheduleService {
  private INTERVAL_STEP = 200;

  public timerExpired$: Observable<void>;
  private timerExpiredSubject$: Subject<void> = new Subject<void>();

  public timerPercentage$: Observable<number>;
  private timerPercentageSubject$: Subject<number> = new Subject<number>();

  private timer: any;
  private initialTime: number = 0;
  private elapsedTime: number = 0;

  constructor() { 
    // this.pageTimerReset$ = this.pageTimerResetSubject$.asObservable();
    this.timerPercentage$ = this.timerPercentageSubject$.asObservable();
    this.timerExpired$ = this.timerExpiredSubject$.asObservable();
  }

  public SetPageTimer(seconds: number) {
    this.initialTime = seconds * 1000;

    if(this.timer?.cancel) {
      this.timer.cancel();
    }

    this.timerPercentageSubject$.next(100);
    this.elapsedTime = 0;

    this.timer = this.accurateTimer(() => this.intervalCallback(), this.INTERVAL_STEP);
  }

  public ResetCurrentTimer() {
    this.SetPageTimer(this.initialTime / 1000);
  }

  private intervalCallback() {
    this.elapsedTime += this.INTERVAL_STEP;

    if(this.elapsedTime > this.initialTime) {
      this.elapsedTime = this.initialTime;
      clearInterval(this.timer);
      this.timerExpiredSubject$.next();
    }

    this.timerPercentageSubject$.next(100 - (this.elapsedTime / this.initialTime) * 100);
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
