import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezvousDetailsComponent } from './rendezvous-details.component';

describe('RendezvousDetailsComponent', () => {
  let component: RendezvousDetailsComponent;
  let fixture: ComponentFixture<RendezvousDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendezvousDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RendezvousDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
