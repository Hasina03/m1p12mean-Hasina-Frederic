import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
 user: any = { name: '', role: '' };

   // Variables pour les menus déroulants
   isDropdownOpen = false;
   isMenuVisible = false; // Pour les véhicules
   isPrestationMenuVisible = false;
   isStockMenuVisible: boolean = false;

   constructor(
     private utilisateurService: UtilisateurService,
     private router: Router
   ) {}

   ngOnInit(): void {
     this.loadUserInfo();
   }

   // Charger les informations utilisateur depuis le token
   loadUserInfo(): void {
     try {
       const userDetails = this.utilisateurService.getUserIdFromToken();
       if (userDetails) {
         this.user.name = userDetails.email || 'Utilisateur';
         this.user.role = userDetails.role || 'Mecanicien';
       } else {
         // Fallback si pas de token valide
         this.user = {
           name: 'Utilisateur',
           role: 'Mecanicien'
         };
       }
     } catch (error) {
       console.error('Erreur lors du chargement des infos utilisateur:', error);
       // Rediriger vers login si token invalide
       this.logout();
     }
   }

   // Gestion du dropdown utilisateur
   toggleDropdown(): void {
     console.log('Toggle dropdown');
     this.isDropdownOpen = !this.isDropdownOpen;
   }

   // Gestion des menus déroulants - Version améliorée
   toggleMenu(menu: string): void {
     // Fermer d'abord tous les autres menus
     this.closeAllMenusExcept(menu);

     switch (menu) {
       case 'stock':
         this.isStockMenuVisible = !this.isStockMenuVisible;
         break;

       case 'vehicules':
         this.isMenuVisible = !this.isMenuVisible;
         break;

       case 'prestation':
         this.isPrestationMenuVisible = !this.isPrestationMenuVisible;
         break;

       default:
         console.warn(`Menu type "${menu}" non reconnu`);
         break;
     }
   }

   // Fermer tous les menus sauf celui spécifié
   private closeAllMenusExcept(exceptMenu: string): void {
     if (exceptMenu !== 'stock') {
       this.isStockMenuVisible = false;
     }
     if (exceptMenu !== 'vehicules') {
       this.isMenuVisible = false;
     }
     if (exceptMenu !== 'prestation') {
       this.isPrestationMenuVisible = false;
     }
   }

   // Fermer tous les menus
   closeAllMenus(): void {
     this.isStockMenuVisible = false;
     this.isMenuVisible = false;
     this.isPrestationMenuVisible = false;
     this.isDropdownOpen = false;
   }

   logout(): void {
     try {
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         localStorage.removeItem('userRole');
         this.isDropdownOpen = false;
         this.user = { name: '', role: '' };

         this.router.navigate(['/login']);

         console.log('Déconnexion réussie');
     } catch (error) {
       console.error('Erreur lors de la déconnexion:', error);
       this.router.navigate(['/login']);
     }
   }
   isAnyMenuOpen(): boolean {
     return this.isStockMenuVisible || this.isMenuVisible || this.isPrestationMenuVisible;
   }

   navigateTo(route: string): void {
     this.closeAllMenus();
     this.router.navigate([route]);
   }

   getUserInitials(): string {
     if (this.user.name) {
       const email = this.user.name;
       if (email.includes('@')) {
         return email.charAt(0).toUpperCase();
       }
       const names = email.split(' ');
       if (names.length >= 2) {
         return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
       }
       return names[0].charAt(0).toUpperCase();
     }
     return 'U';
   }
   isAuthenticated(): boolean {
     return !!localStorage.getItem('token') && !!this.user.name;
   }

   refreshUserData(): void {
     this.loadUserInfo();
   }
}
