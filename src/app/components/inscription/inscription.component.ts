import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../services/utilisateur.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  user = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    mdp: '',
    adresse: '',
    role: 'client'
  };

  errorMessage: string = '';

  constructor(private utilisateurservice: UtilisateurService,private router: Router) {}

  ngOnInit(): void {}

  onInscription(): void {
    this.utilisateurservice.addutilisateur(this.user).subscribe(
      (response) => {

        setTimeout(() => {
          this.router.navigate(['login']);
        }, 1000);
      },
      (error) => {
        console.error('Erreur d\'inscription:', error);
        this.errorMessage = "Erreur lors de l'inscription.";
      }
    );
  }
}
