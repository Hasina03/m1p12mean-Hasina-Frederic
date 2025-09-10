import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeStockPieceComponent } from './liste-stock-piece.component';

describe('ListeStockPieceComponent', () => {
  let component: ListeStockPieceComponent;
  let fixture: ComponentFixture<ListeStockPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeStockPieceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeStockPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
