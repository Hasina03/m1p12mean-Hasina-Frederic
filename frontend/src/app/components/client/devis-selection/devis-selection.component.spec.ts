import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisSelectionComponent } from './devis-selection.component';

describe('DevisSelectionComponent', () => {
  let component: DevisSelectionComponent;
  let fixture: ComponentFixture<DevisSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevisSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevisSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
