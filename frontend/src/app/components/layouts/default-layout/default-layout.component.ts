import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DefaultLayoutService } from '../../../services/layouts/default-layout/default-layout.service';
import { AuthService } from '../../../services/authentification/auth.service';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.css'
})
export class DefaultLayoutComponent implements OnInit {
  prestations: any[] = [];
  isDropdownOpen = false;

  constructor(private defaultLayoutService: DefaultLayoutService,private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    this.defaultLayoutService.getPrestations().subscribe(data => {
      this.prestations = data.map((prestation: any) => ({
        _id: prestation._id,
        nom: prestation.nom
      }));
    });
  }

  checkAuth() {
    const token = localStorage.getItem('token');

    if (token) {
     console.log(token);
      console.log("Utilisateur authentifié, redirection vers Mes rendez-vous");
      this.router.navigate(['/listepiece']);
    } else {
      console.log("Utilisateur NON authentifié, redirection vers Login");
      this.router.navigate(['/login']);
    }}


}
