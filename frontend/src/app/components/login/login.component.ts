import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../services/utilisateur.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
user={email:'',mdp:''};
errorMessage: string = '';

  utilisateur: any[] = [];
    constructor(private utilisateurservice: UtilisateurService, private router: Router) {}
      ngOnInit(): void {
    this.loadUtilisateur();
}
      loadUtilisateur(): void {
    this.utilisateurservice.getUtilisateur().subscribe(data => this.utilisateur =
    data);
  }
  deleteUtilisateur(id: string): void {
this.utilisateurservice.deleteutilisateur(id).subscribe(() =>
this.loadUtilisateur());
  }
  onLogin(): void {
    this.utilisateurservice.login(this.user).subscribe(
      (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          const userDetails = this.utilisateurservice.getUserIdFromToken();
          if (userDetails) {
            switch (userDetails.role) {
              case 'manager':
                this.router.navigate(['/manager']);
                break;
              case 'mecanicien':
                this.router.navigate(['/mecanicien']);
                break;
              case 'client':
                this.router.navigate(['/acceuil']);
                break;
              default:
                this.router.navigate(['/login']);
            }
          } else {
            this.router.navigate(['/login']);
          }
        } else {
          alert('Erreur: Aucun token reçu.');
        }
      },
      (error) => {
        console.error('Erreur de connexion:', error);
        this.errorMessage = "Email ou mot de passe incorrect.";
      }
    );
  }
  quickLogin(role: 'manager' | 'mecanicien' | 'client'): void {
    const testUsers: Record<'manager' | 'mecanicien' | 'client', { email: string; mdp: string }> = {
      manager: { email: 'haingo@gmail.com', mdp: 'motdepass' },
      mecanicien: { email: 'faneva@gmail.com', mdp: 'motdepass' },
      client: { email: 'teddy@gmail.com', mdp: 'motdepass' }
    };

    this.user = testUsers[role];
    this.onLogin();
  }


}


