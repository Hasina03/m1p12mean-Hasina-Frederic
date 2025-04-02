import { Component } from '@angular/core';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {
  user: any = { name: '', role: '' };
  isDropdownOpen = false;
  isMenuVisible = false;
  isStockMenuVisible: boolean = false;

  constructor(private utilisateurService: UtilisateurService,private router: Router) {}

  ngOnInit(): void {
    const userDetails = this.utilisateurService.getUserIdFromToken();
    if (userDetails) {
      this.user.name = userDetails.email;
      this.user.role = userDetails.role;
    }
  }

  toggleDropdown(): void {
    console.log('Toggle dropdown');
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleMenu(menu: string) {
    if (menu === 'stock') {
      this.isStockMenuVisible = !this.isStockMenuVisible;
      if (this.isStockMenuVisible) this.isMenuVisible = false; // Ferme l'autre menu
    } else if (menu === 'vehicules') {
      this.isMenuVisible = !this.isMenuVisible;
      if (this.isMenuVisible) this.isStockMenuVisible = false; // Ferme l'autre menu
    }
  }
  

  logout(): void {
    localStorage.removeItem('token'); // Supprimer le token
    this.isDropdownOpen = false; // Fermer le menu
    this.router.navigate(['/login']); // Rediriger vers login
  }
}
