import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  private apitype = `${environment.apiUrl}/devis`;
 private apiUrl= `${environment.apiUrl}/rendezvous`;


  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  getFacture(rendezvousId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/facture`, { rendezVousId: rendezvousId });
  }


  addRendezVous(rendezVous: any): Observable<any> {
    return this.http.post(this.apiUrl, rendezVous);
  }

  getRendezVous(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }


  getTypesVehicule(): Observable<{ typesVehicules: any[] }> {
    return this.http.get<{ typesVehicules: any[] }>(`${this.apitype}/options`);
  }



getMecaniciens(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/mecanicien`, { headers: this.getHeaders() });
}

updateDateRendezVous(id: string, newDate: string): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    return new Observable(observer => {
      observer.error('Token manquant');
    });
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  const formattedDate = new Date(newDate).toISOString();

  return this.http.put(`${this.apiUrl}/${id}/dates`, { newDate: formattedDate }, { headers });
}


getRendezVousByClient(clientId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/${clientId}/client`);
}

assignMecanicienToRendezvous(id: string, mecanicienId: string) {
  return this.http.put(`${this.apiUrl}/${id}/ajoutmecanicien`, { mecanicienId },{ headers: this.getHeaders() });
}

updateStatus(id: string) {
  return this.http.put(`${this.apiUrl}/${id}/status`,{ headers: this.getHeaders() });
}

}
