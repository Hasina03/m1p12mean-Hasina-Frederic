import { Component, OnInit } from '@angular/core';
import { DevisService } from '../../../services/client/devis/devis.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-devis-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devis-selection.component.html',
  styleUrl: './devis-selection.component.css'
})
export class DevisSelectionComponent implements OnInit {
  vehicules: any[] = [];
  prestations: any[] = [];
  selectedVehiculeId: string | null = null;
  selectedPrestations: string[] = [];

  constructor(private devisService: DevisService, private router: Router) {}

  ngOnInit(): void {
    this.devisService.getVehicules().subscribe(data => {
      this.vehicules = data;
    });

    this.devisService.getPrestations().subscribe(data => {
      this.prestations = data;
    });
  }

  togglePrestation(prestationId: string): void {
    if (this.selectedPrestations.includes(prestationId)) {
      this.selectedPrestations = this.selectedPrestations.filter(id => id !== prestationId);
    } else {
      this.selectedPrestations.push(prestationId);
    }
  }

  genererDevis(): void {
    if (this.selectedVehiculeId && this.selectedPrestations.length > 0) {
      this.router.navigate(['/devis-affichage'], {
        queryParams: { vehiculeId: this.selectedVehiculeId, prestations: this.selectedPrestations.join(',') }
      });
    }
  }
}
