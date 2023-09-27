import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Role } from '../shared/interfaces/role';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

const animation = { duration: 5000, easing: (t: any) => t }

@Component({
  selector: 'app-employee-hierarchy-item',
  templateUrl: './employee-hierarchy-item.component.html',
  styleUrls: ['./employee-hierarchy-item.component.css']
})
export class EmployeeHierarchyItemComponent implements OnInit {
  @ViewChild("empSliderRef") empSliderRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;

  empSlider: KeenSliderInstance = {} as KeenSliderInstance;

  @Input() node!: Role;
  @Input() showPicture: boolean = false;
  @Output() roleClickedEvent = new EventEmitter<Role>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.empSlider = new KeenSlider(this.empSliderRef.nativeElement, {
      loop: true,
      renderMode: "performance",
      drag: false,
      created(s) {
        s.moveToIdx(5, true, animation)
      },
      updated(s) {
        s.moveToIdx(s.track.details.abs + 5, true, animation)
      },
      animationEnded(s) {
        s.moveToIdx(s.track.details.abs + 5, true, animation)
      },
    });
  }

  ngOnDestroy() {
    if (this.empSlider) this.empSlider.destroy()
  }

  roleClicked(role: Role) {
    this.roleClickedEvent.emit(role as Role);
  }

}
