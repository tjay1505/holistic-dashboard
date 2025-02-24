import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandDigitComponent } from './land-digit.component';

describe('LandDigitComponent', () => {
  let component: LandDigitComponent;
  let fixture: ComponentFixture<LandDigitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandDigitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandDigitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
