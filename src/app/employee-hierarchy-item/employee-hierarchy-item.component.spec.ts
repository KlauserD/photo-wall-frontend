import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeHierarchyItemComponent } from './employee-hierarchy-item.component';

describe('EmployeeHierarchyItemComponent', () => {
  let component: EmployeeHierarchyItemComponent;
  let fixture: ComponentFixture<EmployeeHierarchyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeHierarchyItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHierarchyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
