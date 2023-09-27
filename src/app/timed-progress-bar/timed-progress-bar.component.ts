import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TimeScheduleService } from '../shared/services/time-schedule.service';

@Component({
  selector: 'app-timed-progress-bar',
  templateUrl: './timed-progress-bar.component.html',
  styleUrls: ['./timed-progress-bar.component.css']
})
export class TimedProgressBarComponent implements OnInit {
  private INTERVAL_STEP = 100;

  // private _initialTime: number = 0;
  // @Input() set initialTime(value: number) {
  //    this._initialTime = value;
  //    this.onInitialTimeChanged(this._initialTime);
  // }
  // get initialTime(): number { return this._initialTime; }

  @Output() timerExpired = new EventEmitter<void>();

  // timer: ReturnType<typeof setInterval> = {} as ReturnType<typeof setInterval>;
  initialTime: number = 0;
  timer: any;
  elapsedTime: number = 0;

  progressInPercentage: number = 100;

  constructor(
    private timeScheduleService: TimeScheduleService
  ) {
      this.timeScheduleService.pageTimerReset$.subscribe(seconds => this.ResetTimer(seconds));
   }

  ngOnInit(): void {
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log('changes: ', changes);
  // }

  // onInitialTimeChanged(newInitialTime: number) {
  //   // clearInterval(this.timer);
  //   // this.initialTime = 5000;

  //   // console.log('initial time changed');
  //   // this._initialTime = 50000;

  //   if(this.timer?.cancel) {
  //     this.timer.cancel();
  //   }
  //   this.progressInPercentage = 100;
  //   this.elapsedTime = 0;

  //   this.timer = this.accurateTimer(() => this.intervalCallback(), this.INTERVAL_STEP);
  //   // this.timer = setInterval(() => this.intervalCallback(), this.INTERVAL_STEP);
  // }

  ResetTimer(seconds: number) {
    this.initialTime = seconds * 1000;

    if(this.timer?.cancel) {
      this.timer.cancel();
    }
    this.progressInPercentage = 100;
    this.elapsedTime = 0;

    this.timer = this.accurateTimer(() => this.intervalCallback(), this.INTERVAL_STEP);
  }

  intervalCallback() {
    this.elapsedTime += this.INTERVAL_STEP;

    if(this.elapsedTime > this.initialTime) {
      this.elapsedTime = this.initialTime;
      clearInterval(this.timer);
      // this.timerExpired.next();
    }

    this.progressInPercentage = 100 - (this.elapsedTime / this.initialTime) * 100;
  }



  accurateTimer = (fn: () => void, time: number) => {
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
