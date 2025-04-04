import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockpieceService } from '../../../services/stockpiece/stockpiece.service';
import { VehiculeService } from '../../../services/vehicule/vehicule.service';

@Component({
  selector: 'app-piece',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.css'
})
export class PieceComponent {
  pieces: any[] = [];
  vehicules: any[] = [];
  newPiece = {
    nom: '',
    variantes: [{ prix: 0, type_vehicule: '' }]
  };
  errorMessage: string = '';
  messageSuccess = '';
  messageError = '';

  constructor(private stockpieceService: StockpieceService, private vehiculeService: VehiculeService) {}

  ngOnInit(): void {
    this.getPieces();
    this.getVehicules();
  }

  getPieces(): void {
    this.stockpieceService.getpiece().subscribe(
      (data) => {
        this.pieces = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des pièces', error);
        this.errorMessage = 'Erreur lors de la récupération des pièces';
      }
    );
  }

  getVehicules(): void {
    this.vehiculeService.getvehicule().subscribe(
      (data) => {
        this.vehicules = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des véhicules', error);
        this.errorMessage = 'Erreur lors de la récupération des véhicules';
      }
    );
  }

  addPiece(): void {
    if (!this.newPiece.nom || this.newPiece.variantes.some(v => !v.type_vehicule || v.prix <= 0)) {
      this.messageError = 'Veuillez remplir tous les champs correctement ❌';
      return;
    }

    this.stockpieceService.addpiece(this.newPiece).subscribe(
      () => {
        this.messageSuccess = 'Pièce ajoutée avec succès ✅';
        this.messageError = '';
        this.getPieces();
        this.newPiece = { nom: '', variantes: [{ prix: 0, type_vehicule: '' }] };
      },
      (error) => {
        this.messageError = 'Erreur lors de l\'ajout de la pièce ❌';
        this.messageSuccess = '';
        console.error(error);
      }
    );
  }

  deletePiece(id: string): void {
    this.stockpieceService.deletepiece(id).subscribe(
      () => {
        this.getPieces();
      },
      (error) => {
        console.error('Erreur lors de la suppression de la pièce', error);
        this.errorMessage = 'Erreur lors de la suppression de la pièce';
      }
    );
  }
}
