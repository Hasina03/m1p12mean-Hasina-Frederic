import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListevehiculeComponent } from './listevehicule.component';

describe('ListevehiculeComponent', () => {
  let component: ListevehiculeComponent;
  let fixture: ComponentFixture<ListevehiculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListevehiculeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListevehiculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
