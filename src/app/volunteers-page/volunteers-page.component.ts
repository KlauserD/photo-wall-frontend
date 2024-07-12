import { Component, Input, OnInit } from '@angular/core';
import { Volunteer } from '../shared/interfaces/volunteer';

@Component({
  selector: 'app-volunteers-page',
  templateUrl: './volunteers-page.component.html',
  styleUrls: ['./volunteers-page.component.css']
})
export class VolunteersPageComponent implements OnInit {

  @Input() title: string = "";
  @Input() volunteers: Volunteer[] = [];

  sizes = { pictureWidth: 120, pictureHeight: 100, fontSize: 14, lineHeight: 16 };

  constructor() { }

  ngOnInit(): void {
  }

}
