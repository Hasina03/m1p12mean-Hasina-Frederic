import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsHeaderComponent } from '../stats-header/stats-header.component';
import { Router } from '@angular/router';
import { RendezvousService, RendezVous } from '../../../services/mecanicien/rendezvous/rendezvous.service';

@Component({
  selector: 'app-mecanicien-dashboard',
  standalone: true,
  imports: [CommonModule, StatsHeaderComponent],
  templateUrl: './mecanicien-dashboard.component.html',
  styleUrl: './mecanicien-dashboard.component.css'
})
export class MecanicienDashboardComponent implements OnInit {
  rdvAujourdhui: RendezVous[] = [];
  loading = false;
  error: string | null = null;
  dateAujourdhui: string = '';

  constructor(
    private router: Router,
    private rendezvousService: RendezvousService
  ) {
    this.dateAujourdhui = this.formatDate(new Date());
  }

  ngOnInit(): void {
    this.chargerRdvAujourdhui();
  }

  /**
   * Charge les rendez-vous d'aujourd'hui
   */
  chargerRdvAujourdhui(): void {
    this.loading = true;
    this.error = null;

    this.rendezvousService.getRendezVous().subscribe({
      next: (rdvList: RendezVous[]) => {
        // Filtrer les RDV d'aujourd'hui
        const aujourd_hui = new Date();
        aujourd_hui.setHours(0, 0, 0, 0);

        this.rdvAujourdhui = rdvList.filter((rdv: RendezVous) => {
          const dateRdv = new Date(rdv.date_rdv);
          dateRdv.setHours(0, 0, 0, 0);
          return dateRdv.getTime() === aujourd_hui.getTime();
        }).slice(0, 5); // Limiter à 5 RDV

        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des RDV:', error);
        this.error = 'Erreur lors du chargement des rendez-vous';
        this.loading = false;
      }
    });
  }

  /**
   * Navigue vers la liste complète des rendez-vous
   */
  voirTousLesRdv(): void {
    this.router.navigate(['/mecanicien/rendez-vous']);
  }

  /**
   * Navigue vers le détail d'un rendez-vous
   */
  voirDetailRdv(rdvId: string): void {
    this.router.navigate(['/mecanicien/rendez-vous', rdvId]);
  }

  /**
   * Formate une date pour l'affichage
   */
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Formate une heure pour l'affichage
   */
  formatTime(date: string | Date): string {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Retourne la classe CSS pour le statut du RDV
   */
  getStatutClass(statut: string): string {
    switch (statut) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Obtient la date actuelle formatée
   */
  getDateConnexion(): string {
    return this.dateAujourdhui;
  }
}
