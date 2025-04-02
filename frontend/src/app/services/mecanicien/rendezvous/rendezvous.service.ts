import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {

  private apiUrl = 'http://localhost:5000/mecanicien/rendez-vous';

  constructor(private http: HttpClient) {}

  getRendezVous(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getRendezVousDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateStatutPrestation(rendezvousId: string, prestationId: string, statut: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-prestation`, { rendezvousId, prestationId, statut });
  }
}
