import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Prestation {
  _id?: string;
  nom: string;
  description: string;
  prix_main_oeuvre: number;
  supplementMainOeuvre?: SupplementMainOeuvre[];
  processus?: Processus[];
}

export interface SupplementMainOeuvre {
  typeVehicule: string | TypeVehicule;
  supplement: number;
}

export interface Processus {
  ordre: number;
  nom_etape: string;
  pieces_possibles?: string[] | Piece[];
}

export interface Piece {
  _id: string;
  nom: string;
  compatibilites: Compatibilite[];
}

export interface Compatibilite {
  vehicule: string;
  prix: number;
  quantite_stock: number;
  seuil_alerte: number;
}

export interface TypeVehicule {
  _id: string;
  nom: string;
}

export interface PrestationResponse {
  count: number;
  prestations: Prestation[];
}

export interface PieceResponse {
  count: number;
  pieces: Piece[];
}

export interface TypeVehiculeResponse {
  count: number;
  typesVehicule: TypeVehicule[];
}

@Injectable({
  providedIn: 'root'
})
export class PrestationService {
  private apiUrl = 'http://localhost:5000/services-proposes';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getPrestations(): Observable<PrestationResponse> {
    return this.http.get<PrestationResponse>(`${this.apiUrl}`, {
      headers: this.getHeaders()
    });
  }

  getPrestationById(id: string): Observable<Prestation> {
    return this.http.get<Prestation>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createPrestation(prestation: Prestation): Observable<{message: string, prestation: Prestation}> {
    return this.http.post<{message: string, prestation: Prestation}>(this.apiUrl, prestation, {
      headers: this.getHeaders()
    });
  }

  updatePrestation(id: string, prestation: Prestation): Observable<{message: string, prestation: Prestation}> {
    return this.http.put<{message: string, prestation: Prestation}>(`${this.apiUrl}/${id}`, prestation, {
      headers: this.getHeaders()
    });
  }

  deletePrestation(id: string): Observable<{message: string, deletedPrestation: any}> {
    return this.http.delete<{message: string, deletedPrestation: any}>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getPieces(): Observable<PieceResponse> {
    return this.http.get<PieceResponse>(`${this.apiUrl}/pieces`, {
      headers: this.getHeaders()
    });
  }

  getTypesVehicule(): Observable<TypeVehiculeResponse> {
    return this.http.get<TypeVehiculeResponse>(`${this.apiUrl}/types-vehicule`, {
      headers: this.getHeaders()
    });
  }
}
