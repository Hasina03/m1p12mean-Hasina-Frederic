import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RendezvousService } from '../../../services/mecanicien/rendezvous/rendezvous.service';

@Component({
  selector: 'app-stats-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-header.component.html',
  styleUrl: './stats-header.component.css'
})
export class StatsHeaderComponent implements OnInit {
  stats: any = null;
  loading = false;
  error: string | null = null;

  constructor(private rendezvousService: RendezvousService) {}

  ngOnInit(): void {
    this.chargerStats();
  }

  /**
   * Charge les statistiques du mécanicien
   */
  chargerStats(): void {
    this.loading = true;
    this.error = null;

    this.rendezvousService.getStatsMecanicien().subscribe({
      next: (response) => {
        this.stats = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.error = 'Erreur lors du chargement des statistiques';
        this.loading = false;
      }
    });
  }

  /**
   * Actualise les statistiques
   */
  actualiserStats(): void {
    this.chargerStats();
  }

  /**
   * Formate les heures avec une décimale
   */
  formatHeures(heures: number): string {
    return heures.toFixed(1);
  }

  /**
   * Retourne la classe CSS pour le taux de completion
   */
  getTauxCompletionClass(taux: number): string {
    if (taux >= 80) return 'text-green-600';
    if (taux >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }
}
