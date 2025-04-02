import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockpieceService } from '../../../services/stockpiece/stockpiece.service';
import { VehiculeService } from '../../../services/vehicule/vehicule.service';

@Component({
  selector: 'app-piece',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.css'
})
export class PieceComponent {
  pieces: any[] = [];
  newPiece = { nom: '', types: [{ prix: 0, vehicule: '' }] };
  vehicules: any[] = [];
  errorMessage: string = '';


  messageSuccess = '';
  messageError = '';

  constructor(private stockpieceService: StockpieceService,private vehiculeservice:VehiculeService) {}

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
    this.vehiculeservice.getvehicule().subscribe(
      (data) => {
        console.log('Véhicules récupérés:', data);  // Affiche les véhicules récupérés
        this.vehicules = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des véhicules', error);
        this.errorMessage = 'Erreur lors de la récupération des véhicules';
      }
    );
  }



  addPiece(): void {
    this.stockpieceService.addpiece(this.newPiece).subscribe(
      (response) => {
        this.messageSuccess = 'Piece ajouté avec succès ✅';
        this.messageError = '';
        this.getPieces();
        this.newPiece = { nom: '', types: [{ prix: 0, vehicule: '' }] };  // Réinitialiser le formulaire
      },
      (error) => {
        this.messageError = 'Erreur lors de l\'ajout du piece ❌';
        this.messageSuccess = '';
      }
    );
  }


  // Méthode pour supprimer une pièce
  deletePiece(id: string): void {
    this.stockpieceService.deletepiece(id).subscribe(
      (response) => {
        console.log('Pièce supprimée:', response);
        this.getPieces();  // Rafraîchir la liste des pièces
      },
      (error) => {
        console.error('Erreur lors de la suppression de la pièce', error);
        this.errorMessage = 'Erreur lors de la suppression de la pièce';
      }
    );
  }
}
