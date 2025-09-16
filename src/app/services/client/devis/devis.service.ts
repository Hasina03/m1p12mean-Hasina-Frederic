import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevisService {

  private apiUrl = 'https://m1p12mean-frederic-hasina.onrender.com/devis';

  constructor(private http: HttpClient) {}

  getOptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/options`);
  }

  generateDevis(data: { vehiculeId: string, prestationIds: string[] }): Observable<any> {
    return this.http.post(`${this.apiUrl}/generer`, data);
  }
}
