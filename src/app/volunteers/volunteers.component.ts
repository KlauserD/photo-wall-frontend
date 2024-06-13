import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Volunteer } from '../shared/interfaces/volunteer';
import { VolunteersService } from '../shared/services/volunteers.service';
import { VolunteerRealm } from '../shared/interfaces/volunteer-realm';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { TimeScheduleService } from '../shared/services/time-schedule.service';

@Component({
  selector: 'app-volunteers',
  templateUrl: './volunteers.component.html',
  styleUrls: [
    './volunteers.component.css',
    "../../../node_modules/keen-slider/keen-slider.min.css"
  ]
})
export class VolunteersComponent implements OnInit {

  private readonly MAX_EMPS_PER_PAGE: number = 50;

  volunteerPages: VolunteerRealm[] = []

  @Input() slideNumber: number = -1;
  @Input() currentSlideNumber: number = -2;
  @Input() volunteerPageDuration: number = 8;
  @Output() numPagesDetermined = new EventEmitter<number>();

  @ViewChild("sliderVolunteersRef") sliderVolunteersRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;
  sliderVolunteers: KeenSliderInstance = {} as KeenSliderInstance;

  constructor(
    private timeScheduleService: TimeScheduleService,
    private volunteerService: VolunteersService
  ) {
    timeScheduleService.pdfTurnover$.subscribe(() => this.sliderVolunteers.next());
   }

  ngOnInit(): void {
    this.volunteerService.getVolunteerRealms().subscribe(vRealms => {

      // const rktRealm = vRealms.filter(realm => realm.name == 'RKT')[0];

      // let newArray = [];
      // for (let i = 0; i < 15; i++) {
      //   newArray.push(...rktRealm.volunteersArray);
      // }

      // rktRealm.volunteersArray = newArray;

      for (let i = 0; i < vRealms.length; i++) {
        const realm = vRealms[i];

        const realmChunks = [];
        while(realm.volunteersArray.length / this.MAX_EMPS_PER_PAGE > 1) {
          const precedingVolunteerChunk = realm.volunteersArray.splice(0, this.MAX_EMPS_PER_PAGE);
          const realmChunk = {
            name: realm.name,
            volunteersArray: precedingVolunteerChunk
          } as VolunteerRealm;
          
          vRealms.splice(i, 0, realmChunk);
          i++;

          realmChunks.push(realmChunk);
        }

        // push last chunk
        realmChunks.push(realm);

        // append numeration
        if(realmChunks.length > 1) {
          realmChunks.forEach((realmChunk, idx) => realmChunk.name += ` (${idx + 1}/${realmChunks.length})`);
        }
      }

      this.numPagesDetermined.emit(vRealms.length);

      this.volunteerPages = vRealms;
      setTimeout(() => this.sliderVolunteers.update(), 200);
    });
  }

  ngAfterViewInit() {
    this.sliderVolunteers = new KeenSlider(this.sliderVolunteersRef.nativeElement, {
      loop: true,
      slides: {
        origin: 'auto'
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes as any).currentSlideNumber && this.currentSlideNumber == this.slideNumber) {
      this.sliderVolunteers.moveToIdx(0);

      if(this.volunteerPages.length > 1) {
        this.timeScheduleService.SetPdfTurnoverTimer(this.volunteerPageDuration);
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.slideNumber === this.currentSlideNumber) {
      if(event.code === 'NumpadDivide') {
        this.sliderVolunteers.prev();
      } else if(event.code === 'NumpadMultiply') {
        this.sliderVolunteers.next();
      }
    }
  }

  ngOnDestroy() {
    if (this.sliderVolunteers) this.sliderVolunteers.destroy()
  }

}
