import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/authentification/auth.service';
import { Observable } from 'rxjs';
// Assure-toi d'avoir un service d'authentification

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}




  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      return true; // Permet l'accès si le token est présent
    }

    // Sinon, redirige vers la page de connexion
    this.router.navigate(['/login']);
    return false;
  }

}
