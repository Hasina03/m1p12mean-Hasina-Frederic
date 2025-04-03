import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevisService {

  private apiUrl = 'http://localhost:5000/devis';

  constructor(private http: HttpClient) {}

  getOptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/options`);
  }

  generateDevis(data: { typeVehiculeId: string, prestationIds: string[] }): Observable<any> {
    return this.http.post(`${this.apiUrl}/generer`, data);
  }
}
