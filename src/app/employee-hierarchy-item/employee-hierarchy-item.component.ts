import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Function } from '../shared/interfaces/function';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

const animation = { duration: 10000, easing: (t: any) => t }

@Component({
  selector: 'app-employee-hierarchy-item',
  templateUrl: './employee-hierarchy-item.component.html',
  styleUrls: [
    './employee-hierarchy-item.component.css',
    "../../../node_modules/keen-slider/keen-slider.min.css"
  ]
})
export class EmployeeHierarchyItemComponent implements OnInit {
  @ViewChild("empSliderRef") empSliderRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;

  empSlider: KeenSliderInstance = {} as KeenSliderInstance;

  @Input() node!: Function;
  @Input() showPicture: boolean = false;
  @Output() roleClickedEvent = new EventEmitter<Function>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if(this.node.isPictureCollectionNode && this.empSliderRef?.nativeElement) {
      this.empSlider = new KeenSlider(this.empSliderRef.nativeElement, {
        loop: true,
        renderMode: 'performance',
        drag: false,
        slides: {
          spacing: 10,
          perView: "auto",
        },
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
  }

  ngOnDestroy() {
    if (this.empSlider?.destroy) this.empSlider.destroy()
  }

  roleClicked(role: Function) {
    this.roleClickedEvent.emit(role as Function);
  }

}
