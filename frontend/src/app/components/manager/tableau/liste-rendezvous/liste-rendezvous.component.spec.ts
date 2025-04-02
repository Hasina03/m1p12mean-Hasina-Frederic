import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeRendezvousComponent } from './liste-rendezvous.component';

describe('ListeRendezvousComponent', () => {
  let component: ListeRendezvousComponent;
  let fixture: ComponentFixture<ListeRendezvousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeRendezvousComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeRendezvousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
