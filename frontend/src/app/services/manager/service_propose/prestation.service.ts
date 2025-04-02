import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrestationService {

  private apiUrl = 'http://localhost:5000/services-proposes';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les prestations
  getPrestations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Récupérer une prestation par ID
  getPrestationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Ajouter une prestation
  createPrestation(prestation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, prestation);
  }

  // Modifier une prestation
  updatePrestation(id: string, prestation: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, prestation);
  }

  // Supprimer une prestation
  deletePrestation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Récupérer toutes les pièces
  getPieces(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pieces`);
  }

}
