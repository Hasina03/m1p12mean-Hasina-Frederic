import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [FormsModule ,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor(private router: Router){}
  isDropdownOpen = false;
  logout(): void {
    localStorage.removeItem('token'); // Supprimer le token
    this.isDropdownOpen = false; // Fermer le menu
    this.router.navigate(['/login']); // Rediriger vers login
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}
