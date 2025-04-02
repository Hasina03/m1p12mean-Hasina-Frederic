import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DetailPrestationService } from '../../../services/client/detail-prestation/detail-prestation.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-prestation-detail',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './prestation-detail.component.html',
  styleUrl: './prestation-detail.component.css'
})
export class PrestationDetailComponent implements OnInit {
  prestation: any = null;

  constructor(private route: ActivatedRoute, private prestationService: DetailPrestationService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log("ID récupéré depuis l'URL :", id);

      if (id) {
        this.loadPrestation(id);
      }
    });
  }

  loadPrestation(id: string): void {
    this.prestationService.getPrestationById(id).subscribe(
      (data) => {
        console.log("Données reçues :", data);
        this.prestation = data;
      },
      (error) => {
        console.error("Erreur lors de la récupération de la prestation :", error);
      }
    );
  }

  getProcessusList(): string[] {
    if (!this.prestation || !this.prestation.prix_par_vehicule) {
      return [];
    }

    const processusSet = new Set<string>();

    this.prestation.prix_par_vehicule.forEach((vehicule: any) => {
      Object.keys(vehicule.prixPieces).forEach(processus => processusSet.add(processus));
    });

    return Array.from(processusSet);
  }
}
