import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailPrestationService {

  private apiUrl = 'https://m1p12mean-frederic-hasina.onrender.com/prestation';

  constructor(private http: HttpClient) {}

  getPrestationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
