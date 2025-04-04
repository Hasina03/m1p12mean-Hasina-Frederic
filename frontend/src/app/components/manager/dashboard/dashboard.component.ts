import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../../services/manager/dashboard/stats.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  generalStats: any = {};
  topPrestations: any[] = [];

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.fetchGeneralStats();
    this.fetchTopPrestations();
  }

  // Charger les statistiques générales
  fetchGeneralStats() {
    this.statsService.getGeneralStats().subscribe(data => {
      this.generalStats = data;
    });
  }

  // Charger et afficher le graphique des prestations les plus demandées
  fetchTopPrestations() {
    this.statsService.getTopPrestations().subscribe(data => {
      this.topPrestations = data;
      this.createPieChart();
    });
  }

  // Créer le graphique en camembert
  createPieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.topPrestations.map(p => p.nom),
          datasets: [{
            data: this.topPrestations.map(p => p.totalDemandes),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9966FF'],
          }]
        },
        // options: {
        //   responsive: true,
        //   plugins: {
        //     legend: {
        //       labels: {
        //         font: {
        //           size: 20,
        //           // weight: 'bold'
        //         }
        //       }
        //     }
        //   }
        // }
      });
    }
  }
}
