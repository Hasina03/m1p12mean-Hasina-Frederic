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
  typesVehicules: any[] = [];
  prestations: any[] = [];
  selectedTypeVehicule: string = '';
  selectedPrestations: string[] = [];

  constructor(private devisService: DevisService, private router: Router) {}

  ngOnInit() {
    this.devisService.getOptions().subscribe(response => {
      this.typesVehicules = response.typesVehicules;
      this.prestations = response.prestations;
    });
  }

  togglePrestation(prestationId: string) {
    if (this.selectedPrestations.includes(prestationId)) {
      this.selectedPrestations = this.selectedPrestations.filter(id => id !== prestationId);
    } else {
      this.selectedPrestations.push(prestationId);
    }
  }

  generateDevis() {
    if (!this.selectedTypeVehicule || this.selectedPrestations.length === 0) {
      alert("Veuillez sélectionner un type de véhicule et au moins une prestation.");
      return;
    }

    this.router.navigate(['/devis-affichage'], {
      queryParams: { typeVehiculeId: this.selectedTypeVehicule, prestationIds: this.selectedPrestations }
    });
  }
}
