import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { StockpieceService } from '../../../../services/stockpiece/stockpiece.service';

@Component({
  selector: 'app-liste-stock-piece',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './liste-stock-piece.component.html',
  styleUrls: ['./liste-stock-piece.component.css']
})
export class ListeStockPieceComponent {
  pieces: any[] = [];
  filteredPieces: any[] = [];
  searchTerm: string = '';
  page: number = 1;
  itemsPerPage: number = 7;

  constructor(private stockService: StockpieceService) {}

  ngOnInit() {
    this.fetchPieces();
  }

  fetchPieces() {
    this.stockService.getpiece().subscribe(
      data => {
        this.pieces = data;
        this.filteredPieces = data;
      },
      error => console.error('Erreur lors de la récupération des pièces', error)
    );
  }

  onSearchTermChange() {
    this.filterPieces();
  }

  filterPieces() {
    if (!this.searchTerm) {
      this.filteredPieces = [...this.pieces];
      return;
    }
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    const searchWords = normalize(this.searchTerm).split(/\s+/);

    this.filteredPieces = this.pieces.filter(piece => {
      const combined = normalize(`${piece.nom} ${this.getVehiculeCompatibles(piece)}`);
      return searchWords.every(word => combined.includes(word));
    });
  }

  deletePiece(id: string) {
    this.stockService.deletepiece(id).subscribe(
      () => {
        this.pieces = this.pieces.filter(p => p._id !== id);
        this.filterPieces();
      },
      error => console.error('Erreur lors de la suppression de la pièce', error)
    );
  }

  getVehiculeCompatibles(piece: any): string {
    if (piece.compatibilites && piece.compatibilites.length > 0) {
      return piece.compatibilites
        .map((c: any) => `${c.vehicule.marque} ${c.vehicule.modele} (${c.vehicule.annee})`)
        .join(', ');
    } else if (piece.variantes && piece.variantes.length > 0) {
      return piece.variantes.map((v: any) => v.type_vehicule).join(', ');
    } else {
      return 'Aucun véhicule compatible';
    }
  }

  getPrix(piece: any): string {
    if (piece.compatibilites && piece.compatibilites.length > 0) {
      return piece.compatibilites.map((c: any) => c.prix).join(', ');
    } else if (piece.variantes && piece.variantes.length > 0) {
      return piece.variantes.map((v: any) => v.prix).join(', ');
    } else {
      return '-';
    }
  }
}
