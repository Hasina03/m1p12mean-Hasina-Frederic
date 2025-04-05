import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPrestationComponent } from './form-prestation.component';

describe('FormPrestationComponent', () => {
  let component: FormPrestationComponent;
  let fixture: ComponentFixture<FormPrestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPrestationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
