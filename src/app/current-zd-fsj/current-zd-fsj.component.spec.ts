import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentZdFsjComponent } from './current-zd-fsj.component';

describe('CurrentZdFsjComponent', () => {
  let component: CurrentZdFsjComponent;
  let fixture: ComponentFixture<CurrentZdFsjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentZdFsjComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentZdFsjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
