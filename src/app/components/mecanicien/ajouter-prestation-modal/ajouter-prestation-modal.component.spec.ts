import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterPrestationModalComponent } from './ajouter-prestation-modal.component';

describe('AjouterPrestationModalComponent', () => {
  let component: AjouterPrestationModalComponent;
  let fixture: ComponentFixture<AjouterPrestationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterPrestationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterPrestationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
