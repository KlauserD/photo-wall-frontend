import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeHierarchyChildrenContainerComponent } from './employee-hierarchy-children-container.component';

describe('EmployeeHierarchyChildrenContainerComponent', () => {
  let component: EmployeeHierarchyChildrenContainerComponent;
  let fixture: ComponentFixture<EmployeeHierarchyChildrenContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeHierarchyChildrenContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHierarchyChildrenContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
