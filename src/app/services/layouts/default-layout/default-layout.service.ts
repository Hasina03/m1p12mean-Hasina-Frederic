import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefaultLayoutService {

  private apiUrl = 'https://m1p12mean-frederic-hasina.onrender.com/default-layout';

  constructor(private http: HttpClient) {}

  getPrestations(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
