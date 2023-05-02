import { Component, OnInit } from '@angular/core';
import { ZdFsjService } from '../shared/services/zd-fsj.service';
import { ZdFsjTurnus } from '../shared/interfaces/zd-fsj-turnus';

@Component({
  selector: 'app-current-zd-fsj',
  templateUrl: './current-zd-fsj.component.html',
  styleUrls: ['./current-zd-fsj.component.css']
})
export class CurrentZdFsjComponent implements OnInit {

  rotations: ZdFsjTurnus[] = [];

  constructor(
    private _zdFsjService: ZdFsjService
  ) { }

  ngOnInit(): void {
    this._zdFsjService.getLastRotationsWithZdFsj(3).subscribe(rotations => this.rotations = rotations);
  }
}
