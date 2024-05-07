import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealSelectionComponent } from './meal-selection.component';

describe('MealSelectionComponent', () => {
  let component: MealSelectionComponent;
  let fixture: ComponentFixture<MealSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MealSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MealSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
