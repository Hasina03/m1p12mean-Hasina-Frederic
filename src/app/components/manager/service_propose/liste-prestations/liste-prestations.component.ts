import { Component, OnInit } from '@angular/core';
import { PrestationService, Prestation } from '../../../../services/manager/service_propose/prestation.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-liste-prestations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-prestations.component.html',
  styleUrl: './liste-prestations.component.css'
})
export class ListePrestationsComponent implements OnInit {
  prestations: Prestation[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private prestationService: PrestationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadPrestations();
  }

  loadPrestations(): void {
    this.loading = true;
    this.error = null;

    this.prestationService.getPrestations().subscribe({
      next: (response) => {
        this.prestations = response.prestations;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des prestations:', error);
        this.error = 'Erreur lors du chargement des prestations';
        this.loading = false;
      }
    });
  }

  navigateToAddForm(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  navigateToEditForm(id: string): void {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  deletePrestation(id: string, nom: string): void {
    if (confirm(`Voulez-vous vraiment supprimer la prestation "${nom}" ?`)) {
      this.prestationService.deletePrestation(id).subscribe({
        next: (response) => {
          alert(response.message);
          this.loadPrestations(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la prestation');
        }
      });
    }
  }

  // Formater le prix en Ariary
  formatPrice(price: number): string {
    return new Intl.NumberFormat('mg-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Obtenir le nombre d'étapes du processus
  getProcessusCount(prestation: Prestation): number {
    return prestation.processus ? prestation.processus.length : 0;
  }

  // Obtenir le nombre de suppléments
  getSupplementCount(prestation: Prestation): number {
    return prestation.supplementMainOeuvre ? prestation.supplementMainOeuvre.length : 0;
  }

  // Fonction de tracking pour optimiser le rendu de la liste
  trackByPrestationId(index: number, prestation: Prestation): string {
    return prestation._id || index.toString();
  }
}
