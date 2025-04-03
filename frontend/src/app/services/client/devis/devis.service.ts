import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevisService {

  private apiUrl = 'http://localhost:5000/devis';

  constructor(private http: HttpClient) {}

  getDevis(vehiculeId: string, prestationsIds: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/devis`, { vehiculeId, prestationsIds });
  }

  genererDevis(prestations: string[], typeVehiculeId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generer`, { prestations, typeVehiculeId });
  }

  getVehicules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicules`);
  }

  getPrestations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prestations`);
  }
}
