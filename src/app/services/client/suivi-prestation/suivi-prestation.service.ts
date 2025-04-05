import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuiviPrestationService {
  private apiUrl = 'http://localhost:5000/rendez-vous'; // URL de l'API

  constructor(private http: HttpClient) {}

  // Récupérer le statut des prestations d'un rendez-vous
  getStatutsPrestation(rendezVousId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${rendezVousId}/suivi-prestations`);
  }
}
