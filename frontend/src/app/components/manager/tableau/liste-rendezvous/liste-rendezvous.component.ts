import { Component } from '@angular/core';
import { RendezvousService } from '../../../../services/rendez_vous/rendezvous.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-liste-rendezvous',
  standalone: true,
  imports: [CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './liste-rendezvous.component.html',
  styleUrl: './liste-rendezvous.component.css'
})
export class ListeRendezvousComponent {
  rendezVousList: any[] = [];
  selectedVehicule: any = null;
  selectedRendezvous: any = null;
  filteredRendezVous: any[] = [];
  searchTerm: string = '';
  itemsPerPage: number = 3;
  newDate: string = '';
  selectedRendezvousId: string | null = null;

  isReporterModalOpen = false;
page: number = 1;

  isModalOpen: boolean = false;
  selectedMecanicien: string = '';
mecaniciensList: any[] = [];
isMecanicienModalOpen = false;

  constructor(private rendezvousService: RendezvousService) {}

  ngOnInit() {
    this.getRendezVous();
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


  openModal(vehicule: any) {
    console.log("Véhicule sélectionné :", vehicule);
    this.selectedVehicule = vehicule;
    this.isModalOpen = true;
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
