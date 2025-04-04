import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'http://localhost:5000/dashboard';

  constructor(private http: HttpClient) {}

  // Récupérer les statistiques générales
  getGeneralStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/general`);
  }

  // Récupérer les prestations les plus demandées
  getTopPrestations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-prestations`);
  }
}

