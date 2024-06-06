import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Volunteer } from '../shared/interfaces/volunteer';
import { VolunteersService } from '../shared/services/volunteers.service';
import { VolunteerRealm } from '../shared/interfaces/volunteer-realm';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

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

  @ViewChild("sliderVolunteersRef") sliderVolunteersRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;
  sliderVolunteers: KeenSliderInstance = {} as KeenSliderInstance;

  constructor(
    private volunteerService: VolunteersService
  ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.sliderVolunteers = new KeenSlider(this.sliderVolunteersRef.nativeElement, {
      loop: true,
      slides: {
        origin: 'center'
      }
    });

    this.volunteerService.getVolunteerRealms().subscribe(vRealms => {
      for (let i = 0; i < vRealms.length; i++) {
        const realm = vRealms[i];

        while(realm.volunteersArray.length / this.MAX_EMPS_PER_PAGE > 1) {
          const precedingChunk = realm.volunteersArray.splice(0, this.MAX_EMPS_PER_PAGE);
          vRealms.splice(i, 0, {
            name: realm.name,
            volunteersArray: precedingChunk
          } as VolunteerRealm);

          i++;
        }
      }

      this.volunteerPages = vRealms;
    });
  }

  ngOnDestroy() {
    if (this.sliderVolunteers) this.sliderVolunteers.destroy()
  }

}
