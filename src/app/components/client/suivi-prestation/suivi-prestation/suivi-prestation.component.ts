import { Component, OnInit } from '@angular/core';
import { SuiviPrestationService } from '../../../../services/client/suivi-prestation/suivi-prestation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-suivi-prestation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suivi-prestation.component.html',
  styleUrl: './suivi-prestation.component.css'
})
export class SuiviPrestationComponent implements OnInit {
  rendezVousId: string = '';
  rendezVousData: any = null;
  loading = true;
  error: string | null = null;

  // Variables pour l'avis
  modalAvisOuvert = false;
  noteSelectionnee = 0;
  commentaireAvis = '';
  loadingAvis = false;
  successMessage: string | null = null;

  constructor(
    private suiviPrestationService: SuiviPrestationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rendezVousId = this.route.snapshot.paramMap.get('id') || '';
    if (this.rendezVousId) {
      this.chargerSuiviRendezVous();
    } else {
      this.error = 'ID de rendez-vous manquant';
      this.loading = false;
    }
  }

  /**
   * Charge les données du rendez-vous
   */
  chargerSuiviRendezVous(): void {
    this.loading = true;
    this.error = null;

    this.suiviPrestationService.getSuiviRendezVous(this.rendezVousId).subscribe({
      next: (response) => {
        if (response.success) {
          this.rendezVousData = response.data;
        } else {
          this.error = response.message || 'Erreur lors du chargement';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du suivi:', error);
        this.error = error.error?.message || 'Erreur lors du chargement du suivi des prestations';
        this.loading = false;
      }
    });
  }

  /**
   * Formate une date pour l'affichage
   */
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Retourne la classe CSS pour le statut
   */
  getStatutClass(statut: string): string {
    switch (statut) {
      case 'En attente': return 'text-yellow-600 bg-yellow-100';
      case 'En cours': return 'text-blue-600 bg-blue-100';
      case 'Terminé': return 'text-green-600 bg-green-100';
      case 'Annulé': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Retourne l'icône pour le statut
   */
  getStatutIcon(statut: string): string {
    switch (statut) {
      case 'En attente': return '⏳';
      case 'En cours': return '🔄';
      case 'Terminé': return '✅';
      case 'Annulé': return '❌';
      default: return '⚪';
    }
  }

  /**
   * Ouvre le modal pour donner un avis
   */
  ouvrirModalAvis(): void {
    this.modalAvisOuvert = true;
    this.noteSelectionnee = 0;
    this.commentaireAvis = '';
  }

  /**
   * Ferme le modal d'avis
   */
  fermerModalAvis(): void {
    this.modalAvisOuvert = false;
    this.noteSelectionnee = 0;
    this.commentaireAvis = '';
    this.error = null;
  }

  /**
   * Sélectionne une note (étoiles)
   */
  selectionnerNote(note: number): void {
    this.noteSelectionnee = note;
  }

  /**
   * Soumet l'avis
   */
  soumettreAvis(): void {
    if (this.noteSelectionnee === 0) {
      this.error = 'Veuillez sélectionner une note';
      return;
    }

    this.loadingAvis = true;
    this.error = null;

    this.suiviPrestationService.donnerAvis(this.rendezVousId, this.noteSelectionnee, this.commentaireAvis)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Avis enregistré avec succès !';
            this.fermerModalAvis();
            this.chargerSuiviRendezVous(); // Recharger pour mettre à jour l'affichage

            setTimeout(() => {
              this.successMessage = null;
            }, 3000);
          } else {
            this.error = response.message || 'Erreur lors de l\'enregistrement de l\'avis';
          }
          this.loadingAvis = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement de l\'avis:', error);
          this.error = error.error?.message || 'Erreur lors de l\'enregistrement de l\'avis';
          this.loadingAvis = false;
        }
      });
  }

  /**
   * Retourne à la liste des rendez-vous
   */
  retourListeRendezVous(): void {
    this.router.navigate(['/client/rendez-vous']); // Ajustez la route selon votre structure
  }

  /**
   * Génère un tableau d'étoiles pour l'affichage
   */
  getEtoiles(note: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  /**
   * Ferme les messages de succès
   */
  fermerSuccessMessage(): void {
    this.successMessage = null;
  }
}
