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

  private readonly MAX_EMPS_PER_PAGE: number = 5;

  volunteerPages: VolunteerRealm[] = []

  @ViewChild("sliderVolunteersRef") sliderVolunteersRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;
  sliderVolunteers: KeenSliderInstance = {} as KeenSliderInstance;

  constructor(
    private volunteerService: VolunteersService
  ) { }

  ngOnInit(): void {
    this.volunteerService.getVolunteerRealms().subscribe(vRealms => {

      console.log('vRealms: ', vRealms);

      for (let i = 0; i < vRealms.length; i++) {
        const realm = vRealms[i];
        
        console.log('realm: ', realm.name)
        console.log('length', (realm.volunteersArray.length));
        console.log('max emps', this.MAX_EMPS_PER_PAGE);

        while(realm.volunteersArray.length / this.MAX_EMPS_PER_PAGE > 1) {

          console.log('splitting')

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

  ngAfterViewInit() {
    this.sliderVolunteers = new KeenSlider(this.sliderVolunteersRef.nativeElement, {
      loop: true,
      slides: {
        origin: 'center'
      }
    });
  }

  ngOnDestroy() {
    if (this.sliderVolunteers) this.sliderVolunteers.destroy()
  }

}
