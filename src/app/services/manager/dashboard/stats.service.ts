import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GeneralStats {
  totalRendezVous: number;
  rendezVousParStatut: {
    enAttente: number;
    confirmes: number;
    annules: number;
    termines: number;
  };
  totalClients: number;
  totalTechniciens: number;
  totalVehicules: number;
  totalPieces: number;
  piecesFaibleStock: PieceFaibleStock[];
  moyenneNote: number | null;
  totalAvis: number;
  rendezVousAujourdHui: number;
  dateCalcul: string;
}

export interface PieceFaibleStock {
  pieceId: string;
  nomPiece: string;
  vehicule: {
    marque: string;
    modele: string;
    annee: number;
  };
  quantite_stock: number;
  seuil_alerte: number;
}

export interface TopPrestation {
  prestationId: string;
  nom: string;
  prix_main_oeuvre: number;
  totalDemandes: number;
}

export interface PieceAlert {
  pieceId: string;
  nomPiece: string;
  compatibiliteId: string;
  vehicule: {
    id: string;
    marque: string;
    modele: string;
    annee: number;
  };
  prix: number;
  quantite_stock: number;
  seuil_alerte: number;
}

export interface RevenueData {
  periode: {
    from: string;
    to: string;
  };
  totalRevenu: number;
  nombrePrestations: number;
  nombreRendezVous: number;
  avertissement: string;
  dateCalcul: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'https://m1p12mean-frederic-hasina.onrender.com/dashboard';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getGeneralStats(): Observable<GeneralStats> {
    return this.http.get<GeneralStats>(`${this.apiUrl}/general`, {
      headers: this.getHeaders()
    });
  }

  getTopPrestations(): Observable<TopPrestation[]> {
    return this.http.get<TopPrestation[]>(`${this.apiUrl}/top-prestations`, {
      headers: this.getHeaders()
    });
  }

  getPiecesAlert(): Observable<{totalAlert: number, pieces: PieceAlert[]}> {
    return this.http.get<{totalAlert: number, pieces: PieceAlert[]}>(`${this.apiUrl}/pieces-alert`, {
      headers: this.getHeaders()
    });
  }

  getRevenue(from: string, to: string): Observable<RevenueData> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    return this.http.get<RevenueData>(`${this.apiUrl}/revenue`, {
      headers: this.getHeaders(),
      params: params
    });
  }
}
