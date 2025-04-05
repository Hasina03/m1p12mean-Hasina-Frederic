import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RendezvousService } from '../../../services/mecanicien/rendezvous/rendezvous.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rendezvous-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rendezvous-details.component.html',
  styleUrl: './rendezvous-details.component.css'
})
export class RendezvousDetailsComponent implements OnInit {
  rendezVous: any;
  selectedStatut: string = '';

  constructor(private route: ActivatedRoute, private rendezvousService: RendezvousService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.rendezvousService.getRendezVousDetails(id).subscribe(data => {
      this.rendezVous = data;
    });
  }

  updateStatut(prestationId: string): void {
    if (!this.selectedStatut) return;

    this.rendezvousService.updateStatutPrestation(this.rendezVous.id, prestationId, this.selectedStatut)
      .subscribe(updatedData => {
        this.rendezVous = updatedData.rendezVous;
        this.selectedStatut = '';
      });
  }
}
