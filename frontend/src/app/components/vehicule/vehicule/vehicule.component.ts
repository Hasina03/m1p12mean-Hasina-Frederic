import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehiculeService } from '../../../services/vehicule/vehicule.service';

@Component({
  selector: 'app-vehicule',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './vehicule.component.html',
  styleUrl: './vehicule.component.css'
})
export class VehiculeComponent {

  vehicule = {
    marque: '',
    modele: '',
    annee: null,
    type_moteur: '',
  };

  messageSuccess = '';
  messageError = '';

  constructor(private vehiculeService: VehiculeService) {}
  onSubmit() {
    this.vehiculeService.addvehicule(this.vehicule).subscribe(
      response => {
        this.messageSuccess = 'Véhicule ajouté avec succès ✅';
        this.messageError = '';
        console.log('vehicule créé', response);
      },
      error => {
        console.error('Erreur lors de la création du vehicule', error);
        this.messageError = 'Erreur lors de l\'ajout du véhicule ❌';
        this.messageSuccess = '';
      }
    );
  }
}
