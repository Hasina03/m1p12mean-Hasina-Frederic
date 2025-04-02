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

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Vérifie si l'utilisateur est authentifié en regardant la présence du token
    if (this.authService.isAuthenticated()) {
      console.log('Utilisateur authentifié');
      return true; // Accès autorisé
    } else {
      console.log('Utilisateur non authentifié');
      this.router.navigate(['/login']); // Redirige vers la page de connexion
      return false; // Accès interdit
    }
  }

}
