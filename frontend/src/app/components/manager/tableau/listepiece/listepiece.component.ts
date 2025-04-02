import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { StockpieceService } from '../../../../services/stockpiece/stockpiece.service';

@Component({
  selector: 'app-listepiece',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './listepiece.component.html',
  styleUrl: './listepiece.component.css'
})
export class ListepieceComponent {
  pieces: any[] = [];
  filteredPieces: any[] = [];
  searchTerm: string = ''; // Rechercher par nom de pièce
  vehicleSearchTerm: string = ''; // Rechercher par marque ou modèle de véhicule
  engineSearchTerm: string = ''; // Rechercher par type de moteur
  page: number = 1;
  itemsPerPage: number = 7;

  constructor(private stockpieceService: StockpieceService) {}

  ngOnInit() {
    this.fetchPieces();
  }

  fetchPieces() {
    this.stockpieceService.getpiece().subscribe(
      data => {
        this.pieces = data;
        this.filteredPieces = data;
      },
      error => console.error('Erreur lors de la récupération des pièces', error)
    );
  }

  onSearchTermChange() {
    this.filteredPieces = this.pieces.filter(piece =>
      this.filterByName(piece) &&
      this.filterByVehicle(piece) &&
      this.filterByEngine(piece)
    );
  }

  filterByName(piece: any): boolean {
    return piece.nom.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

  filterByVehicle(piece: any): boolean {
    const vehicle = piece.types[0]?.vehicule;
    const vehicleSearch = this.vehicleSearchTerm.toLowerCase();
    return !vehicleSearch ||
      vehicle?.marque.toLowerCase().includes(vehicleSearch) ||
      vehicle?.modele.toLowerCase().includes(vehicleSearch);
  }

  filterByEngine(piece: any): boolean {
    const engineSearch = this.engineSearchTerm.toLowerCase();
    return !engineSearch || piece.types[0]?.vehicule?.type_moteur.toLowerCase().includes(engineSearch);
  }

  deletePiece(id: string) {
    this.stockpieceService.deletepiece(id).subscribe(
      () => {
        this.pieces = this.pieces.filter(p => p._id !== id);
        this.onSearchTermChange();
      },
      error => console.error('Erreur lors de la suppression de la pièce', error)
    );
  }
}
