import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TimeScheduleService } from '../shared/services/time-schedule.service';

@Component({
  selector: 'app-timed-progress-bar',
  templateUrl: './timed-progress-bar.component.html',
  styleUrls: ['./timed-progress-bar.component.css']
})
export class TimedProgressBarComponent implements OnInit {

  progressInPercentage: number = 100;

  constructor(
    private timeScheduleService: TimeScheduleService
  ) {
      this.timeScheduleService.slideTimerPercentage$.subscribe(pct => this.progressInPercentage = pct);
   }

  ngOnInit(): void {
  }

}
