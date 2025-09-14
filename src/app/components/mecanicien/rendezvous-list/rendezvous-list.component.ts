import { Component, OnInit } from '@angular/core';
import { RendezvousService, RendezVous } from '../../../services/mecanicien/rendezvous/rendezvous.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AjouterPrestationModalComponent } from '../ajouter-prestation-modal/ajouter-prestation-modal.component';

@Component({
  selector: 'app-rendezvous-list',
  standalone: true,
  imports: [CommonModule, AjouterPrestationModalComponent],
  providers: [DatePipe],
  templateUrl: './rendezvous-list.component.html',
  styleUrl: './rendezvous-list.component.css'
})
export class RendezvousListComponent implements OnInit {
  rendezVousList: RendezVous[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  modalAjoutOuvert = false;
  rdvIdPourAjout = '';

  constructor(
    private rendezvousService: RendezvousService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.chargerRendezVous();
  }

  /**
   * Charge la liste des rendez-vous
   */
  chargerRendezVous(): void {
    this.loading = true;
    this.error = null;

    this.rendezvousService.getRendezVous().subscribe({
      next: (data) => {
        this.rendezVousList = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rendez-vous:', error);
        this.error = 'Erreur lors du chargement des rendez-vous';
        this.loading = false;
      }
    });
  }

  /**
   * Démarre une réparation avec confirmation
   */
  onCommencer(rdvId: string, prestationId?: string): void {
    const prestationText = prestationId ? 'cette prestation' : 'la première prestation en attente';
    const confirmMessage = `Êtes-vous sûr de vouloir commencer ${prestationText} ?`;

    if (confirm(confirmMessage)) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      this.rendezvousService.commencerReparation(rdvId, prestationId).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Réparation démarrée avec succès';
          this.chargerRendezVous(); // Recharger la liste

          // Effacer le message après 3 secondes
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => {
          console.error('Erreur lors du démarrage de la réparation:', error);
          this.error = error.error?.message || 'Erreur lors du démarrage de la réparation';
          this.loading = false;
        }
      });
    }
  }

  /**
   * Termine une prestation avec confirmation
   */
  onTerminer(rdvId: string, prestationId: string): void {
    if (confirm('Êtes-vous sûr de vouloir terminer cette prestation ?')) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      this.rendezvousService.terminerPrestation(rdvId, prestationId).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Prestation terminée avec succès';
          this.chargerRendezVous();

          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => {
          console.error('Erreur lors de la finalisation de la prestation:', error);
          this.error = error.error?.message || 'Erreur lors de la finalisation de la prestation';
          this.loading = false;
        }
      });
    }
  }

  /**
   * Annule une prestation avec confirmation et motif
   */
  onAnnuler(rdvId: string, prestationId: string): void {
    const motif = prompt('Motif d\'annulation (optionnel):');

    // Si l'utilisateur clique sur "Annuler" dans le prompt, motif sera null
    if (motif !== null) {
      if (confirm('Êtes-vous sûr de vouloir annuler cette prestation ?')) {
        this.loading = true;
        this.error = null;
        this.successMessage = null;

        this.rendezvousService.annulerPrestation(rdvId, prestationId, motif || undefined).subscribe({
          next: (response) => {
            this.successMessage = response.message || 'Prestation annulée avec succès';
            this.chargerRendezVous();

            setTimeout(() => {
              this.successMessage = null;
            }, 3000);
          },
          error: (error) => {
            console.error('Erreur lors de l\'annulation de la prestation:', error);
            this.error = error.error?.message || 'Erreur lors de l\'annulation de la prestation';
            this.loading = false;
          }
        });
      }
    }
  }

  /**
   * Ouvre le modal pour ajouter une prestation
   */
  ouvrirModalAjout(rdvId: string): void {
    this.rdvIdPourAjout = rdvId;
    this.modalAjoutOuvert = true;
  }

  /**
   * Ferme le modal d'ajout
   */
  fermerModalAjout(): void {
    this.modalAjoutOuvert = false;
    this.rdvIdPourAjout = '';
  }

  /**
   * Gère l'ajout d'une prestation
   */
  onPrestationAjoutee(response: any): void {
    this.successMessage = response.message || 'Prestation ajoutée avec succès';
    this.chargerRendezVous(); // Recharger la liste

    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  /**
   * Navigation vers les détails (fonction existante conservée)
   */
  viewDetails(id: string): void {
    this.router.navigate(['/rendezvous', id]);
  }

  /**
   * Formate une date pour l'affichage
   */
  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }

  /**
   * Formate un temps pour l'affichage
   */
  formatTime(date: string | Date): string {
    return this.datePipe.transform(date, 'HH:mm') || '';
  }

  /**
   * Détermine si une prestation peut être démarrée
   */
  peutCommencerPrestation(prestation: any): boolean {
    return prestation.statut_actuel === 'En attente';
  }

  /**
   * Détermine si une prestation peut être terminée
   */
  peutTerminerPrestation(prestation: any): boolean {
    return prestation.statut_actuel === 'En cours';
  }

  /**
   * Détermine si une prestation peut être annulée
   */
  peutAnnulerPrestation(prestation: any): boolean {
    return prestation.statut_actuel === 'En cours' || prestation.statut_actuel === 'En attente';
  }

  /**
   * Obtient la classe CSS pour le statut d'une prestation
   */
  getStatutPrestationClass(statut: string): string {
    switch (statut) {
      case 'En attente': return 'bg-gray-100 text-gray-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Obtient la classe CSS pour le statut du rendez-vous
   */
  getStatutRdvClass(statut: string): string {
    switch (statut) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmé': return 'bg-green-100 text-green-800';
      case 'Terminé': return 'bg-blue-100 text-blue-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Obtient la classe CSS pour la bordure de prestation selon le statut
   */
  getPrestationBorderClass(statut: string): string {
    switch (statut) {
      case 'En attente': return 'border-gray-300 bg-gray-50';
      case 'En cours': return 'border-blue-400 bg-blue-50';
      case 'Terminé': return 'border-green-400 bg-green-50';
      case 'Annulé': return 'border-red-400 bg-red-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  }

  /**
   * Obtient la classe CSS pour l'icône de statut de prestation
   */
  getPrestationIconClass(statut: string): string {
    switch (statut) {
      case 'En attente': return 'bg-gray-200 text-gray-600';
      case 'En cours': return 'bg-blue-200 text-blue-600';
      case 'Terminé': return 'bg-green-200 text-green-600';
      case 'Annulé': return 'bg-red-200 text-red-600';
      default: return 'bg-gray-200 text-gray-600';
    }
  }

  /**
   * Calcule et retourne la progression d'un rendez-vous
   */
  getProgression(prestations: any[]): number {
    if (!prestations || prestations.length === 0) return 0;

    const prestationsActives = prestations.filter(p => p.statut_actuel !== 'Annulé');
    if (prestationsActives.length === 0) return 0;

    const prestationsTerminees = prestationsActives.filter(p => p.statut_actuel === 'Terminé').length;
    return Math.round((prestationsTerminees / prestationsActives.length) * 100);
  }

  /**
   * Calcule le temps écoulé pour une prestation en cours
   */
  getTempsEcoule(prestation: any): string | null {
    if (prestation.statut_actuel === 'En cours' && prestation.statuts.En_cours) {
      const debut = new Date(prestation.statuts.En_cours);
      const maintenant = new Date();
      const diffMs = maintenant.getTime() - debut.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffMinutes < 60) {
        return `${diffMinutes}min`;
      } else {
        const heures = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        return `${heures}h${minutes.toString().padStart(2, '0')}`;
      }
    }

    if (prestation.statut_actuel === 'Terminé' && prestation.statuts.En_cours && prestation.statuts.Terminé) {
      const debut = new Date(prestation.statuts.En_cours);
      const fin = new Date(prestation.statuts.Terminé);
      const diffMs = fin.getTime() - debut.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffMinutes < 60) {
        return `${diffMinutes}min`;
      } else {
        const heures = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        return `${heures}h${minutes.toString().padStart(2, '0')}`;
      }
    }

    return null;
  }

  /**
   * Ferme le message d'erreur
   */
  fermerErreur(): void {
    this.error = null;
  }

  /**
   * Ferme le message de succès
   */
  fermerSucces(): void {
    this.successMessage = null;
  }

  /**
   * Fonction temporaire pour le bouton réparer (ne fait rien pour l'instant)
   */
  onReparer(rdvId: string): void {
    // Fonction vide pour éviter les erreurs
    console.log('Bouton réparer cliqué pour le RDV:', rdvId);
    // TODO: Implémenter la logique de réparation
  }

  /**
   * Vérifie s'il y a des prestations qui peuvent être commencées
   */
  hasCommencablePrestation(prestations: any[]): boolean {
    return prestations.some(p => this.peutCommencerPrestation(p));
  }

  /**
   * Compte le nombre de prestations terminées
   */
  getPrestationsTerminees(prestations: any[]): number {
    return prestations.filter(p => p.statut_actuel === 'Terminé').length;
  }

  /**
   * Compte le nombre de prestations en cours
   */
  getPrestationsEnCours(prestations: any[]): number {
    return prestations.filter(p => p.statut_actuel === 'En cours').length;
  }
}
