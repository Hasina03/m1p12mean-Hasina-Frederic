import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  isAuthenticated(): boolean {

    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  login(token: string) {
    localStorage.setItem('token', token);
    console.log('Utilisateur connecté, token enregistré.');
  }

  logout() {
    localStorage.removeItem('token');
    console.log('Utilisateur déconnecté, token supprimé.');
  }
}
