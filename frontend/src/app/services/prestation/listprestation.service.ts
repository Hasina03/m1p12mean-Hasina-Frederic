import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListprestationService {
   private apiUrl= `${environment.apiUrl}/services-proposes`;

  constructor(private http:HttpClient) { }

  getprestation(): Observable<any> {
    return this.http.get(this.apiUrl);
      }
}
