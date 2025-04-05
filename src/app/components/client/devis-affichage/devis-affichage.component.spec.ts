import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisAffichageComponent } from './devis-affichage.component';

describe('DevisAffichageComponent', () => {
  let component: DevisAffichageComponent;
  let fixture: ComponentFixture<DevisAffichageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevisAffichageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevisAffichageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
