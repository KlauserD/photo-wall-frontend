import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotowallPageComponent } from './photowall-page.component';

describe('PhotowallPageComponent', () => {
  let component: PhotowallPageComponent;
  let fixture: ComponentFixture<PhotowallPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotowallPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotowallPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
