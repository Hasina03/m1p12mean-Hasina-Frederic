import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecanicienDashboardComponent } from './mecanicien-dashboard.component';

describe('MecanicienDashboardComponent', () => {
  let component: MecanicienDashboardComponent;
  let fixture: ComponentFixture<MecanicienDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MecanicienDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MecanicienDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
