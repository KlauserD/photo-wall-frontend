import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeScheduleService {

  public pageTimerReset$: Observable<number>;
  private pageTimerResetSubject$: Subject<number> = new Subject<number>();

  constructor() { 
    this.pageTimerReset$ = this.pageTimerResetSubject$.asObservable();
  }

  public SetPageTimer(seconds: number) {
    this.pageTimerResetSubject$.next(seconds);
  }
}
