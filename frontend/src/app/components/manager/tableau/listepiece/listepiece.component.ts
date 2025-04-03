import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { RendezvousService } from '../../../../services/rendez_vous/rendezvous.service';
import { UtilisateurService } from '../../../../services/utilisateur.service';
import { jsPDF } from "jspdf";
import "jspdf-autotable";


@Component({
  selector: 'app-listepiece',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './listepiece.component.html',
  styleUrl: './listepiece.component.css'
})
export class ListepieceComponent {
  rendezVousList: any[] = [];
    selectedVehicule: any = null;
    selectedRendezvous: any = null;
    filteredRendezVous: any[] = [];
    searchTerm: string = '';
    itemsPerPage: number = 5;
    newDate: string = '';
    selectedRendezvousId: string | null = null;

    isReporterModalOpen = false;
  page: number = 1;

    isModalOpen: boolean = false;
    selectedMecanicien: string = '';
  mecaniciensList: any[] = [];
  isMecanicienModalOpen = false;

    constructor(private rendezvousService: RendezvousService,private utilisateurservice: UtilisateurService) {}

    ngOnInit() {
      // Récupérer le token dans localStorage
      const token = localStorage.getItem('token');

      if (token) {
        try {

          const decodedToken: any = this.utilisateurservice.getUserIdFromToken();
          const clientId = decodedToken.id;
          console.log(clientId);

          if (clientId) {
            this.getRendezVousByClient(clientId);
          } else {
            console.error("Aucun ID de client trouvé dans le token.");
          }
        } catch (error) {
          console.error('Erreur lors du décodage du token', error);
        }
      } else {
        console.error('Aucun token trouvé.');
      }
    }

    exportPdf() {
      const doc = new jsPDF('p', 'mm', [150, 200]);

      // Définir les styles de la facture
      doc.setFont("times", "normal");
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 255);

      // Ajouter le titre de la facture
      const title = 'Facture';
      const titleWidth = doc.getTextWidth(title);
      const titleX = (doc.internal.pageSize.width - titleWidth) / 2; // Calculer la position horizontale centrée
      doc.text(title, titleX, 20);

      // Ajouter des informations générales
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Retour à la couleur noire
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 40);
      doc.text(`Client: ${this.selectedRendezvous?.client_id?.nom} ${this.selectedRendezvous?.client_id?.prenom}`, 10, 50);

      // Ajouter une ligne décorative
      doc.setDrawColor(0, 0, 0);
      doc.line(10, 60, 140, 60); // Ajusté pour correspondre à la largeur du PDF

      // Ajouter un tableau pour les prestations
      const prestations = this.selectedRendezvous?.prestation.map((p: any) => [
        p.prestation_id?.nom,
        p.prestation_id?.prix_main_oeuvre
      ]) || [];

      let yPosition = 70; // Position initiale

      doc.setFontSize(14);
      doc.text('Prestations', 10, yPosition);

      yPosition += 10; // Laisser un espace après le titre

      // Titre des colonnes
      doc.text('Nom', 10, yPosition);
      doc.text('Prix', 120, yPosition);

      yPosition += 10; // Descendre pour le contenu

      // Contenu des prestations
      prestations.forEach((p: any) => {
        doc.text(p[0], 10, yPosition); // Nom
        doc.text(p[1].toString(), 120, yPosition); // Prix (Correction ici)
        yPosition += 10;
      });

      // Ajouter un tableau pour les pièces
      const pieces = this.selectedRendezvous?.pieces.map((piece: any) => [
        piece.nom,
        piece.prix
      ]) || [];

      // Ajouter un espace avant le tableau des pièces
      yPosition += 10;

      doc.setFontSize(14);
      doc.text('Pièces', 10, yPosition);

      yPosition += 10; // Laisser un espace après le titre

      // Titre des colonnes
      doc.text('Nom', 10, yPosition);
      doc.text('Prix', 120, yPosition);

      yPosition += 10;

      // Contenu des pièces
      if (pieces.length > 0) {
        pieces.forEach((piece: any) => {
          doc.text(piece[0], 10, yPosition); // Nom
          doc.text(piece[1].toString(), 120, yPosition); // Prix
          yPosition += 10;
        });
      } else {
        doc.text('Aucune pièce pour cette facture.', 10, yPosition);
        yPosition += 10;
      }

      // Ajouter le total de la facture
      doc.setFontSize(14);
      doc.text(`Total: ${this.selectedRendezvous?.total}`, 10, yPosition);

      // Sauvegarder le fichier PDF
      doc.save('facture.pdf');
    }



    getRendezVous() {
      this.rendezvousService.getRendezVous().subscribe(
        (data) => {
          console.log(data);
          this.rendezVousList = data;
          this.filteredRendezVous = [...this.rendezVousList];
        },
        (error) => {
          console.error('Erreur lors du chargement des rendez-vous', error);
        }
      );
    }

    getRendezVousByClient(clientId: string) {
      this.rendezvousService.getRendezVousByClient(clientId).subscribe(
        (data) => {
          console.log("Rendez-vous du client :", data);
          this.rendezVousList = data;
          this.filteredRendezVous = [...this.rendezVousList];
        },
        (error) => {
          console.error("Erreur lors du chargement des rendez-vous du client", error);
        }
      );
    }

    updatestatus(userId: string): void {
      this.rendezvousService.updateStatus(userId).subscribe(
        (response) => {
          console.log('Rôle mis à jour avec succès', response);
          this.getRendezVous();
          this.closeModal();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du rôle', error);
        }
      );
    }

    updateDate(userId: string, newDate: string): void {
      this.rendezvousService.updateDateRendezVous(userId, newDate).subscribe(
        (response) => {
          console.log('Rendez-vous mis à jour avec succès', response);
          this.getRendezVous();
          this.closeModal();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du rendez-vous', error);
        }
      );
    }

    updateRendezVousDate(): void {
      if (this.selectedRendezvousId && this.newDate) {



        this.updateDate(this.selectedRendezvousId, this.newDate);
        this.closeReporterModal();
      } else {
        console.error('La date ou le rendez-vous n\'est pas valide');
      }
    }

    filterRendezVous(): void {
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();

        this.filteredRendezVous = this.rendezVousList.filter(rdv =>
          (rdv.client_id?.nom?.toLowerCase().includes(searchLower) ||
           rdv.statut?.toLowerCase().includes(searchLower))
        );
      } else {
        this.filteredRendezVous = [...this.rendezVousList];
      }

      console.log("Résultats filtrés :", this.filteredRendezVous);
    }


    onSearchTermChange(): void {
      console.log("Recherche : ", this.searchTerm);
      this.filterRendezVous();
    }


    openModal(rendezvousId: string) {
      console.log("ID rendez-vous envoyé:", rendezvousId); // Vérifie que l'ID est correct
      this.rendezvousService.getFacture(rendezvousId).subscribe(
        (data) => {
          console.log('Facture reçue:', data);
          this.selectedRendezvous = data;
          this.selectedVehicule = data.vehicule;
          this.isModalOpen = true;
        },
        (error) => {
          console.error('Erreur lors de la récupération de la facture:', error);
        }
      );
    }




    openReporterModal(rendezvousId: string): void {
      console.log(rendezvousId);
      this.selectedRendezvousId = rendezvousId;
      this.isReporterModalOpen = true;
    }
    closeReporterModal(): void {
      this.isReporterModalOpen = false;
      this.newDate = '';
    }

    closeModal(): void {
      this.isModalOpen = false;
    }

    openMecanicienModal(rendezvous: any) {
      this.selectedRendezvous = rendezvous;
      this.isMecanicienModalOpen = true;


      this.rendezvousService.getMecaniciens().subscribe(
        (data) => {
          this.mecaniciensList = data;
        },
        (error) => {
          console.error("Erreur lors du chargement des mécaniciens :", error);
        }
      );
    }


    closeMecanicienModal() {
      this.isMecanicienModalOpen = false;
      this.selectedMecanicien = '';
    }


    assignMecanicien() {
      if (!this.selectedMecanicien) {
        alert("Veuillez sélectionner un mécanicien.");
        return;
      }
      this.rendezvousService.assignMecanicienToRendezvous(this.selectedRendezvous._id, this.selectedMecanicien)
        .subscribe(
          (response) => {
            console.log("Mécanicien assigné avec succès :", response);
            this.closeMecanicienModal();
            this.getRendezVous();
          },
          (error) => {
            console.error("Erreur lors de l'assignation du mécanicien :", error);
          }
        );
    }
}
