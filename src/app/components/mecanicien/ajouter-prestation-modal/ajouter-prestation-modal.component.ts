import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RendezvousService } from '../../../services/mecanicien/rendezvous/rendezvous.service';

@Component({
  selector: 'app-ajouter-prestation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter-prestation-modal.component.html',
  styleUrl: './ajouter-prestation-modal.component.css'
})
export class AjouterPrestationModalComponent implements OnInit {
  @Input() rdvId: string = '';
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() prestationAjoutee = new EventEmitter<any>();

  prestationsDisponibles: any[] = [];
  selectedPrestationId: string = '';
  motif: string = '';
  loading = false;
  loadingPrestations = false;
  error: string | null = null;

  constructor(private rendezvousService: RendezvousService) {}

  ngOnInit(): void {
    this.chargerPrestations();
  }

  /**
   * Charge la liste des prestations disponibles depuis la base de données
   */
  chargerPrestations(): void {
    this.loadingPrestations = true;
    this.error = null;

    this.rendezvousService.getPrestationsDisponibles().subscribe({
      next: (prestations) => {
        this.prestationsDisponibles = prestations;
        this.loadingPrestations = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des prestations:', error);
        this.error = 'Erreur lors du chargement des prestations disponibles';
        this.loadingPrestations = false;

        // Fallback sur des prestations par défaut en cas d'erreur
        this.prestationsDisponibles = [
          { _id: '1', nom: 'Vidange moteur', description: 'Changement huile et filtre', prix_main_oeuvre: 45 },
          { _id: '2', nom: 'Changement plaquettes', description: 'Remplacement plaquettes de frein', prix_main_oeuvre: 80 }
        ];
      }
    });
  }

  /**
   * Obtient la prestation sélectionnée
   */
  getPrestationSelectionnee(): any {
    return this.prestationsDisponibles.find(p => p._id === this.selectedPrestationId);
  }

  /**
   * Obtient la description de la prestation sélectionnée
   */
  getDescriptionSelectionnee(): string {
    const prestation = this.getPrestationSelectionnee();
    return prestation ? prestation.description : '';
  }

  /**
   * Obtient le prix de la prestation sélectionnée
   */
  getPrixSelectionnee(): number {
    const prestation = this.getPrestationSelectionnee();
    return prestation ? prestation.prix_main_oeuvre : 0;
  }

  /**
   * Obtient le texte du bouton selon l'état de chargement
   */
  getTexteBouton(): string {
    return this.loading ? 'Ajout...' : 'Ajouter';
  }

  /**
   * Vérifie si le bouton d'ajout doit être désactivé
   */
  isBoutonDesactive(): boolean {
    return this.loading || !this.selectedPrestationId || this.loadingPrestations;
  }

  /**
   * Ajoute la prestation sélectionnée
   */
  ajouterPrestation(): void {
    if (!this.selectedPrestationId) {
      this.error = 'Veuillez sélectionner une prestation';
      return;
    }

    this.loading = true;
    this.error = null;

    this.rendezvousService.ajouterPrestation(this.rdvId, this.selectedPrestationId, this.motif || undefined)
      .subscribe({
        next: (response) => {
          this.prestationAjoutee.emit(response);
          this.fermerModal();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la prestation:', error);
          this.error = error.error?.message || 'Erreur lors de l\'ajout de la prestation';
          this.loading = false;
        }
      });
  }

  /**
   * Ferme le modal
   */
  fermerModal(): void {
    this.selectedPrestationId = '';
    this.motif = '';
    this.error = null;
    this.loading = false;
    this.close.emit();
  }

  /**
   * Gère le clic sur le backdrop
   */
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.fermerModal();
    }
  }

  /**
   * Recharge les prestations manuellement
   */
  rechargerPrestations(): void {
    this.chargerPrestations();
  }
}
