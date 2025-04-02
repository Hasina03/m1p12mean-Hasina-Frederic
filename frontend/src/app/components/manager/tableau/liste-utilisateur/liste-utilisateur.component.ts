import { Component } from '@angular/core';
import { UtilisateurService } from '../../../../services/utilisateur.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-liste-utilisateur',
  standalone: true,
  imports: [CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './liste-utilisateur.component.html',
  styleUrl: './liste-utilisateur.component.css'
})
export class ListeUtilisateurComponent {

  utilisateurs: any[] = [];
  filteredUtilisateurs: any[] = [];
  searchTerm: string = '';
  selectedUtilisateur: any;
  newRole: string = '';
  isRoleModalOpen: boolean = false;

  page: number = 1; // Page actuelle
  itemsPerPage: number = 10; // Nombre d'éléments par page

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.getUtilisateurs();
  }
  filterUtilisateurs(): void {
    if (this.searchTerm) {
      // Filtrage des utilisateurs selon le terme de recherche
      this.filteredUtilisateurs = this.utilisateurs.filter(utilisateur =>
        utilisateur.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        utilisateur.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        utilisateur.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // Si la recherche est vide, on réinitialise la liste filtrée
      this.filteredUtilisateurs = [...this.utilisateurs];
    }
  }

  // Cette méthode doit être appelée à chaque changement du champ de recherche
  onSearchTermChange(): void {
    this.filterUtilisateurs();
  }

  getUtilisateurs(): void {
    this.utilisateurService.getUtilisateur().subscribe(
      (data) => {
        console.log(data);
        this.utilisateurs = data;
        this.filterUtilisateurs();
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }
  openRoleModal(utilisateur: any): void {
    this.selectedUtilisateur = utilisateur;
    this.isRoleModalOpen = true;
    this.newRole = utilisateur.role; // set current role as the default selected role
  }

  // Close the modal
  closeRoleModal(): void {
    this.isRoleModalOpen = false;
    this.selectedUtilisateur = null;
    this.newRole = '';
  }

  updateRole(userId: string, newRole: string): void {
    this.utilisateurService.updateRoleUtilisateur(userId, newRole).subscribe(
      (response) => {
        console.log('Rôle mis à jour avec succès', response);
        this.getUtilisateurs();
        this.closeRoleModal();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du rôle', error);
      }
    );
  }

  deleteUtilisateur(userId: string): void {
    const userDetails = this.utilisateurService.getUserIdFromToken();
    if (userDetails) {
      if (userDetails.role === 'manager') {
        // Assurez-vous d'envoyer le token dans l'en-tête de la requête
        this.utilisateurService.deleteutilisateur(userId).subscribe(
          (response) => {
            console.log('Utilisateur supprimé avec succès', response);
            this.getUtilisateurs();
          },
          (error) => {
            console.error('Erreur lors de la suppression de l utilisateur', error);
          }
        );
      } else {
        console.error('Permission insuffisante : L\'utilisateur doit avoir le rôle manager');
      }
    } else {
      console.error('Utilisateur non authentifié');
    }
  }
}

