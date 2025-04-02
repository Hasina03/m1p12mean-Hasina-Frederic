import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private apiUrl = 'http://localhost:5000/rendez-vous';

  constructor(private http: HttpClient) {}

  // Ajouter un avis à un rendez-vous
  addAvis(rendezVousId: string, avis: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${rendezVousId}/avis`, avis);
  }

  // Modifier un avis existant
  updateAvis(rendezVousId: string, avis: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${rendezVousId}/avis`, avis);
  }

  // Supprimer un avis
  deleteAvis(rendezVousId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${rendezVousId}/avis`);
  }
}
