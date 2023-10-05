import { Component, OnInit } from '@angular/core';
import { ZdFsjService } from '../shared/services/zd-fsj.service';
import { ZdFsjTurnus } from '../shared/interfaces/zd-fsj-turnus';
import { TurnusService } from '../shared/services/turnus.service';
import { Turnus } from '../shared/interfaces/turnus';

@Component({
  selector: 'app-current-zd-fsj',
  templateUrl: './current-zd-fsj.component.html',
  styleUrls: ['./current-zd-fsj.component.css']
})
export class CurrentZdFsjComponent implements OnInit {

  turnuses: Turnus[] = [];

  sizesForTurnusCount: { pictureWidth: number, pictureHeight: number, fontSize: number, lineHeight: number}[] = 
  [
    { pictureWidth: 110, pictureHeight: 80, fontSize: 13, lineHeight: 15 }, 
    { pictureWidth: 110, pictureHeight: 80, fontSize: 13, lineHeight: 15 },
    { pictureWidth: 110, pictureHeight: 80, fontSize: 13, lineHeight: 15 },
    { pictureWidth: 110, pictureHeight: 80, fontSize: 13, lineHeight: 15 },
    { pictureWidth: 90, pictureHeight: 65, fontSize: 12, lineHeight: 14 },
    { pictureWidth: 75, pictureHeight: 55, fontSize: 12, lineHeight: 13 },
    { pictureWidth: 55, pictureHeight: 45, fontSize: 10, lineHeight: 11 },
  ]

  // rotations: ZdFsjTurnus[] = [];

  constructor(
    private _turnusService: TurnusService
  ) { }

  ngOnInit(): void {
    // this._zdFsjService.getLastRotationsWithZdFsj(3).subscribe(rotations => this.rotations = rotations);
    this._turnusService.getLastTurnuses(4).subscribe(turnuses => this.turnuses = turnuses);
    
  }
}
