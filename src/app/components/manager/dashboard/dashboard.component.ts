import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatsService, GeneralStats, TopPrestation, PieceAlert, RevenueData } from '../../../services/manager/dashboard/stats.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Données principales
  generalStats: GeneralStats | null = null;
  topPrestations: TopPrestation[] = [];
  piecesAlert: PieceAlert[] = [];
  totalAlert = 0;
  revenueData: RevenueData | null = null;

  // États de chargement
  loading = {
    general: true,
    prestations: true,
    pieces: true,
    revenue: false
  };

  // Graphiques
  private pieChart: Chart | null = null;
  private barChart: Chart | null = null;

  // Période pour le revenu (par défaut: mois actuel)
  dateFrom: string = '';
  dateTo: string = '';

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.initializeDateRange();
    this.fetchAllStats();
  }

  ngOnDestroy(): void {
    // Nettoyer les graphiques
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.barChart) {
      this.barChart.destroy();
    }
  }

  // Initialiser les dates par défaut (mois actuel)
  initializeDateRange(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    this.dateFrom = firstDay.toISOString().split('T')[0];
    this.dateTo = lastDay.toISOString().split('T')[0];
  }

  // Charger toutes les statistiques
  fetchAllStats(): void {
    this.fetchGeneralStats();
    this.fetchTopPrestations();
    this.fetchPiecesAlert();
  }

  // Charger les statistiques générales
  fetchGeneralStats(): void {
    this.loading.general = true;
    this.statsService.getGeneralStats().subscribe({
      next: (data) => {
        this.generalStats = data;
        this.loading.general = false;
        this.createStatusChart();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stats générales:', error);
        this.loading.general = false;
      }
    });
  }

  // Charger les top prestations
  fetchTopPrestations(): void {
    this.loading.prestations = true;
    this.statsService.getTopPrestations().subscribe({
      next: (data) => {
        this.topPrestations = data;
        this.loading.prestations = false;
        this.createPieChart();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des top prestations:', error);
        this.loading.prestations = false;
      }
    });
  }

  // Charger les pièces en alerte
  fetchPiecesAlert(): void {
    this.loading.pieces = true;
    this.statsService.getPiecesAlert().subscribe({
      next: (data) => {
        this.piecesAlert = data.pieces;
        this.totalAlert = data.totalAlert;
        this.loading.pieces = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des alertes pièces:', error);
        this.loading.pieces = false;
      }
    });
  }

  // Charger les données de revenu
  fetchRevenue(): void {
    if (!this.dateFrom || !this.dateTo) {
      alert('Veuillez sélectionner une période valide');
      return;
    }

    this.loading.revenue = true;
    this.statsService.getRevenue(this.dateFrom, this.dateTo).subscribe({
      next: (data) => {
        this.revenueData = data;
        this.loading.revenue = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du revenu:', error);
        this.loading.revenue = false;
      }
    });
  }

  // Créer le graphique en secteurs des prestations
  createPieChart(): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (ctx && this.topPrestations.length > 0) {
      // Détruire le graphique existant
      if (this.pieChart) {
        this.pieChart.destroy();
      }

      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.topPrestations.map(p => p.nom),
          datasets: [{
            data: this.topPrestations.map(p => p.totalDemandes),
            backgroundColor: [
              '#3B82F6', // blue-500
              '#10B981', // emerald-500
              '#F59E0B', // amber-500
              '#EF4444', // red-500
              '#8B5CF6'  // violet-500
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const prestation = this.topPrestations[context.dataIndex];
                  return `${prestation.nom}: ${prestation.totalDemandes} demandes (${this.formatCurrency(prestation.prix_main_oeuvre)})`;
                }
              }
            }
          }
        }
      });
    }
  }

  // Créer le graphique en barres des statuts RDV
  createStatusChart(): void {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (ctx && this.generalStats) {
      // Détruire le graphique existant
      if (this.barChart) {
        this.barChart.destroy();
      }

      const stats = this.generalStats.rendezVousParStatut;

      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['En attente', 'Confirmés', 'Terminés', 'Annulés'],
          datasets: [{
            label: 'Nombre de RDV',
            data: [stats.enAttente, stats.confirmes, stats.termines, stats.annules],
            backgroundColor: [
              '#F59E0B', // amber-500 - en attente
              '#3B82F6', // blue-500 - confirmés
              '#10B981', // emerald-500 - terminés
              '#EF4444'  // red-500 - annulés
            ],
            borderRadius: 4,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
  }

  // Calculer le pourcentage des RDV terminés
  getCompletionRate(): number {
    if (!this.generalStats || this.generalStats.totalRendezVous === 0) return 0;
    return Math.round((this.generalStats.rendezVousParStatut.termines / this.generalStats.totalRendezVous) * 100);
  }

  // Formater la moyenne des notes
  getFormattedAverage(): string {
    if (!this.generalStats || this.generalStats.moyenneNote === null) return 'N/A';
    return `${this.generalStats.moyenneNote}/5`;
  }

  // Obtenir le nombre d'étoiles pour l'affichage
  getStarArray(): boolean[] {
    if (!this.generalStats || this.generalStats.moyenneNote === null) return [];
    const rating = Math.round(this.generalStats.moyenneNote);
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  // Formater le montant en Ariary malgache
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('mg-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Obtenir la classe CSS pour le niveau d'alerte stock
  getStockAlertClass(piece: PieceAlert): string {
    const ratio = piece.quantite_stock / piece.seuil_alerte;
    if (ratio === 0) return 'text-red-600 bg-red-50';
    if (ratio <= 0.5) return 'text-red-500 bg-red-50';
    return 'text-orange-500 bg-orange-50';
  }
}
