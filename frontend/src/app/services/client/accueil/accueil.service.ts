import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccueilService {

  private apiUrl = 'http://localhost:5000/acceuil';

  constructor(private http: HttpClient) {}

  getPrestations(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
