import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuiviPrestationService {
  private apiUrl = 'https://m1p12mean-frederic-hasina.onrender.com/rendez-vous';

  constructor(private http: HttpClient) {}

  /**
   * Génère les headers avec le token d'authentification
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Récupère le détail complet d'un rendez-vous avec suivi des prestations
   */
  getSuiviRendezVous(rendezVousId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${rendezVousId}/suivi-prestations`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Permet au client de donner un avis sur le rendez-vous
   */
  donnerAvis(rendezVousId: string, note: number, commentaire?: string): Observable<any> {
    const body = {
      note: note,
      commentaire: commentaire || ''
    };
    return this.http.put<any>(`${this.apiUrl}/${rendezVousId}/avis`, body, {
      headers: this.getHeaders()
    });
  }
}
