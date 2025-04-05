import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailPrestationService {

  private apiUrl = 'http://localhost:5000/prestation';

  constructor(private http: HttpClient) {}

  getPrestationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
