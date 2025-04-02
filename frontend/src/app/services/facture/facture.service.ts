import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl= `${environment.apiUrl}/facture`;

  constructor(private http:HttpClient) { }

  getprestation(): Observable<any> {
    return this.http.get(this.apiUrl);
      }

      exportPDF(utilisateurs: any): void {
        const exportUrl = `${environment.apiUrl}`;
        this.http.post(exportUrl, { utilisateurs }, { responseType: 'blob' })
          .subscribe(response => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'facture.pdf';
            link.click();
          });
      }
}
