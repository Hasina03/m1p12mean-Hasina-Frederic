import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DevisService } from '../../../services/client/devis/devis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-devis-affichage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devis-affichage.component.html',
  styleUrl: './devis-affichage.component.css'
})
export class DevisAffichageComponent implements OnInit {
  vehiculeId: string = '';
  prestationsIds: string[] = [];
  devis: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private devisService: DevisService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.vehiculeId = params['vehiculeId'];
      this.prestationsIds = params['prestationsIds'] ? params['prestationsIds'].split(',') : [];

      if (this.vehiculeId && this.prestationsIds.length > 0) {
        this.fetchDevis();
      } else {
        this.errorMessage = "Données manquantes pour générer le devis.";
        this.isLoading = false;
      }
    });
  }

  fetchDevis(): void {
    this.devisService.getDevis(this.vehiculeId, this.prestationsIds).subscribe({
      next: (data) => {
        this.devis = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Erreur lors de la récupération du devis.";
        this.isLoading = false;
      }
    });
  }
}
