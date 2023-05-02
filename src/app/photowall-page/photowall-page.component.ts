import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PdfService } from '../shared/services/pdf.service';
import { PhotowallPage } from '../shared/interfaces/photowall-page';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

@Component({
  selector: 'app-photowall-page',
  templateUrl: './photowall-page.component.html',
  styleUrls: ['./photowall-page.component.css']
})
export class PhotowallPageComponent implements OnInit {

  @Input() photowallPage: PhotowallPage = {} as PhotowallPage

  @ViewChild("sliderPdfRef") sliderPdfRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;
  sliderPdf: KeenSliderInstance = {} as KeenSliderInstance;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.sliderPdf = new KeenSlider(this.sliderPdfRef.nativeElement, {
      loop: true,
      initial: 0,
      vertical: true
    });
  }

  ngOnDestroy() {
    if (this.sliderPdf) this.sliderPdf.destroy()
  }
}
