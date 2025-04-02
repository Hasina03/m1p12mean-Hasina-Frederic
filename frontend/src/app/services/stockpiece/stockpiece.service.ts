import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockpieceService {

  private apiUrl= `${environment.apiUrl}/piece`;
  constructor( private http: HttpClient) {}

  addpiece(piece: any): Observable<any> {
        return this.http.post(this.apiUrl, piece);
  }
  getpiece(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deletepiece(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return new Observable(observer => {
        observer.error('Token manquant');
      });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
