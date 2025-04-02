import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{HttpHeaders} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl= `${environment.apiUrl}/login`;
  private apiUrlInscription= `${environment.apiUrl}/users`;


  constructor(private http: HttpClient,private router: Router) { }
        getUtilisateur(): Observable<any> {
          return this.http.get(this.apiUrlInscription);
      }
        addutilisateur(utilisateur: any): Observable<any> {
          return this.http.post(this.apiUrlInscription, utilisateur);
      }
        login(utilisateur: any): Observable<any> {
          return this.http.post(this.apiUrl, utilisateur);
      }
        updateutilisateur(id: string, utilisateur: any): Observable<any> {
          return this.http.put(`${this.apiUrl}/${id}`, utilisateur);
      }


      deleteutilisateur(id: string): Observable<any> {
        const token = localStorage.getItem('token');
        if (!token) {
          return new Observable(observer => {
            observer.error('Token manquant');
          });
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.delete(`${this.apiUrlInscription}/${id}`, { headers });  // Requête DELETE avec le token
      }

      updateRoleUtilisateur(id: string, role: string): Observable<any> {
        const token = localStorage.getItem('token');
        if (!token) {
          return new Observable(observer => {
            observer.error('Token manquant');
          });
        }
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.put(`${this.apiUrlInscription}/${id}`, { role },{headers});
      }


        logout() {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
       }
      getUserIdFromToken(): { id: string; role: string; email: string } | null {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const decodedToken: any = jwtDecode(token);

            return {
              id: decodedToken.id,
              role: decodedToken.role,
              email: decodedToken.email
            };
          } catch (error) {
            console.error('Erreur lors du décodage du token:', error);
            return null;
          }
        }
        return null;
      }
    }

