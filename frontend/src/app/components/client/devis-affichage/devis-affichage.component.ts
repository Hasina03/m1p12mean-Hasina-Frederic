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
  devis: any = null;

  constructor(private route: ActivatedRoute, private devisService: DevisService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const typeVehiculeId = params['typeVehiculeId'];

      // Vérifier si prestationIds est un tableau ou une chaîne unique
      let prestationIds: string[] = [];
      if (Array.isArray(params['prestationIds'])) {
        prestationIds = params['prestationIds'];
      } else if (params['prestationIds']) {
        prestationIds = [params['prestationIds']];
      }

      this.devisService.generateDevis({ typeVehiculeId, prestationIds }).subscribe(response => {
        this.devis = response;
      });
    });
  }
}
