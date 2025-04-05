import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviPrestationComponent } from './suivi-prestation.component';

describe('SuiviPrestationComponent', () => {
  let component: SuiviPrestationComponent;
  let fixture: ComponentFixture<SuiviPrestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviPrestationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuiviPrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
