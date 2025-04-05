import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePrestationsComponent } from './liste-prestations.component';

describe('ListePrestationsComponent', () => {
  let component: ListePrestationsComponent;
  let fixture: ComponentFixture<ListePrestationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListePrestationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListePrestationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
