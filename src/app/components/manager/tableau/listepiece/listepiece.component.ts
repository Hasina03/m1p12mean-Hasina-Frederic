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
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: any = this.utilisateurservice.getUserIdFromToken();
          const clientId = decodedToken.id;
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


          const maxHeight = doc.internal.pageSize.height - 10;
      let yPosition = 20;
      let facture=18;
      const garageName = 'Facture';
      let fontSize = 11;
      doc.setFont("times", "bold");
      doc.setFontSize(facture);
      doc.setTextColor(0, 0, 255);
      const garageNameWidth = doc.getTextWidth(garageName);
      const garageNameX = (doc.internal.pageSize.width - garageNameWidth) / 2;

      doc.text(garageName, garageNameX, yPosition);
      yPosition += 20;

      let font = 16;
      doc.setFontSize(font);
      doc.setTextColor(0, 0, 0);
      doc.text(`Garage HF`, 10, yPosition);
      yPosition += 10;
      doc.setFont("times", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(0, 0, 0);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, yPosition);
      yPosition += 10;


      const selectedRdv = this.rendezVousList.find(rdv => rdv._id === this.selectedRendezvousId);
      if (selectedRdv) {
        const clientNom = selectedRdv.client_id?.nom || 'Nom client non trouvé';
        const clientPrenom = selectedRdv.client_id?.prenom || 'Prénom non trouvé';
        doc.text(`Client: ${clientNom} ${clientPrenom}`, 10, yPosition);
      } else {
        doc.text('Client non trouvé', 10, yPosition);
      }

      doc.setDrawColor(0, 0, 0);
      doc.line(10, yPosition + 10, 140, yPosition + 10);

      const prestations = this.selectedRendezvous?.prestation.map((p: any) => [
        p.prestation_id?.nom,
        p.prestation_id?.prix_main_oeuvre
      ]) || [];

      yPosition += 20;
      doc.setFontSize(fontSize);
      doc.text('Prestations', 10, yPosition);
      yPosition += 10;

      doc.text('Nom', 10, yPosition);
      doc.text('Prix', 120, yPosition);
      yPosition += 10;

      prestations.forEach((p: any) => {
        doc.text(p[0], 10, yPosition);
        doc.text(p[1].toString(), 120, yPosition);
        yPosition += 10;
      });

      const pieces = this.selectedRendezvous?.pieces.map((piece: any) => [
        piece.nom,
        piece.prix
      ]) || [];

      yPosition += 10;
      doc.setFontSize(fontSize);
      doc.text('Pièces', 10, yPosition);
      yPosition += 10;

      doc.text('Nom', 10, yPosition);
      doc.text('Prix', 120, yPosition);
      yPosition += 10;

      pieces.forEach((piece: any) => {
        doc.text(piece[0], 10, yPosition);
        doc.text(piece[1].toString(), 120, yPosition);
        yPosition += 10;
      });

      const totalText = 'Total:';
      const totalAmount = this.selectedRendezvous?.total;
      const totalAmountText = totalAmount ? `${totalAmount} Ariary` : '0 Ariary';  

      const totalTextWidth = doc.getTextWidth(totalText);
      const totalAmountWidth = doc.getTextWidth(totalAmountText);
      const totalX = doc.internal.pageSize.width - totalAmountWidth - 10;
      doc.setFontSize(fontSize);
      doc.text(totalText, 10, yPosition);
      doc.text(totalAmountText, totalX, yPosition);

      const contentHeight = yPosition + 10;

      if (contentHeight > maxHeight) {
        fontSize = Math.floor(fontSize * (maxHeight / contentHeight));
        doc.setFontSize(fontSize);
        yPosition = 20;
      }

      doc.save('facture.pdf');
    }


    getRendezVous() {
      this.rendezvousService.getRendezVous().subscribe(
        (data) => {
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
      this.selectedRendezvousId = rendezvousId;
      this.rendezvousService.getFacture(rendezvousId).subscribe(
        (data) => {
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
            this.closeMecanicienModal();
            this.getRendezVous();
          },
          (error) => {
            console.error("Erreur lors de l'assignation du mécanicien :", error);
          }
        );
    }
}
