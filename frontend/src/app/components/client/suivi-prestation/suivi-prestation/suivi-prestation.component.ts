import { Component, OnInit } from '@angular/core';
import { SuiviPrestationService } from '../../../../services/client/suivi-prestation/suivi-prestation.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suivi-prestation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suivi-prestation.component.html',
  styleUrl: './suivi-prestation.component.css'
})
export class SuiviPrestationComponent implements OnInit {
  rendezVousId: string = '';
  prestations: any[] = [];

  constructor(
    private suiviPrestationService: SuiviPrestationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.rendezVousId = this.route.snapshot.paramMap.get('id') || '';
    this.suiviPrestationService.getStatutsPrestation(this.rendezVousId).subscribe(
      (data) => { this.prestations = data; },
      (error) => { console.error("Erreur lors du chargement du suivi des prestations", error); }
    );
  }
}
