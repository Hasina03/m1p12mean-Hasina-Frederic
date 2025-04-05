import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListepieceComponent } from './listepiece.component';

describe('ListepieceComponent', () => {
  let component: ListepieceComponent;
  let fixture: ComponentFixture<ListepieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListepieceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListepieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
