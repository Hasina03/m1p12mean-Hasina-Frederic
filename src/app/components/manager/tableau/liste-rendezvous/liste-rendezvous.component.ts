import { Component } from '@angular/core';
import { RendezvousService } from '../../../../services/rendez_vous/rendezvous.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-liste-rendezvous',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
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

  // ===== STATISTIQUES DYNAMIQUES =====
  get confirmedCount(): number {
    return this.rendezVousList.filter(rdv =>
      rdv.statut === 'Confirmé' || rdv.statut === 'confirmed' || rdv.statut === 'Confirmé'
    ).length;
  }

  get pendingCount(): number {
    return this.rendezVousList.filter(rdv =>
      rdv.statut === 'En attente' || rdv.statut === 'pending' || rdv.statut === 'Attente'
    ).length;
  }

  // ===== MÉTHODES DE DONNÉES =====
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

  // ===== MISE À JOUR AVEC STATISTIQUES DYNAMIQUES =====
  updatestatus(userId: string): void {
    // 1. Mise à jour locale immédiate pour réactivité
    const rdvIndex = this.rendezVousList.findIndex(rdv => rdv._id === userId);
    if (rdvIndex !== -1) {
      this.rendezVousList[rdvIndex].statut = 'Confirmé';
      this.updateFilteredList();
    }

    // 2. Appel API
    this.rendezvousService.updateStatus(userId).subscribe(
      (response) => {
        console.log('Statut confirmé avec succès');
        // Optionnel: recharger depuis le serveur pour être sûr
        // this.getRendezVous();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du statut', error);
        // Reverser le changement local en cas d'erreur
        if (rdvIndex !== -1) {
          this.rendezVousList[rdvIndex].statut = 'En attente';
          this.updateFilteredList();
        }
      }
    );
  }

  updateDate(userId: string, newDate: string): void {
    // 1. Mise à jour locale immédiate
    const rdvIndex = this.rendezVousList.findIndex(rdv => rdv._id === userId);
    if (rdvIndex !== -1) {
      this.rendezVousList[rdvIndex].date_rdv = newDate;
      this.rendezVousList[rdvIndex].statut = 'En attente'; // Reporter remet en attente
      this.updateFilteredList();
    }

    // 2. Appel API
    this.rendezvousService.updateDateRendezVous(userId, newDate).subscribe(
      (response) => {
        console.log('Date mise à jour avec succès');
        this.closeModal();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du rendez-vous', error);
        // Reverser le changement en cas d'erreur
        this.getRendezVous();
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

  // ===== ASSIGNATION MÉCANICIEN AVEC MISE À JOUR DYNAMIQUE =====
  assignMecanicien() {
    if (!this.selectedMecanicien) {
      alert("Veuillez sélectionner un mécanicien.");
      return;
    }

    // 1. Mise à jour locale immédiate
    const rdvIndex = this.rendezVousList.findIndex(rdv => rdv._id === this.selectedRendezvous._id);
    if (rdvIndex !== -1) {
      const mecanicien = this.mecaniciensList.find(m => m._id === this.selectedMecanicien);
      this.rendezVousList[rdvIndex].mecanicien_id = mecanicien;
      this.rendezVousList[rdvIndex].statut = 'Confirmé'; // Assigner confirme le RDV
      this.updateFilteredList();
    }

    // 2. Appel API
    this.rendezvousService.assignMecanicienToRendezvous(this.selectedRendezvous._id, this.selectedMecanicien)
      .subscribe(
        (response) => {
          console.log('Mécanicien assigné avec succès');
          this.closeMecanicienModal();
        },
        (error) => {
          console.error("Erreur lors de l'assignation du mécanicien :", error);
          // Reverser en cas d'erreur
          this.getRendezVous();
        }
      );
  }

  // ===== MÉTHODES DE FILTRAGE =====
  updateFilteredList(): void {
    if (this.searchTerm) {
      this.filterRendezVous();
    } else {
      this.filteredRendezVous = [...this.rendezVousList];
    }
  }

  filterRendezVous(): void {
    if (this.searchTerm) {
      const normalize = (str: string) =>
        str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();
      const searchWords = normalize(this.searchTerm).split(/\s+/);

      this.filteredRendezVous = this.rendezVousList.filter(rdv => {
        const nom = rdv.client_id?.nom || "";
        const prenom = rdv.client_id?.prenom || "";
        const statut = rdv.statut || "";
        const mecanicienNom = rdv.mecanicien_id?.nom || "";
        const mecanicienPrenom = rdv.mecanicien_id?.prenom || "";

        const combined = normalize(`${nom} ${prenom} ${statut} ${mecanicienNom} ${mecanicienPrenom}`);
        return searchWords.every(word => combined.includes(word));
      });
    } else {
      this.filteredRendezVous = [...this.rendezVousList];
    }

    console.log("Résultats filtrés :", this.filteredRendezVous);
  }

  onSearchTermChange(): void {
    this.filterRendezVous();
  }

  // ===== GESTION DES MODALES =====
  openModal(vehicule: any) {
    this.selectedVehicule = vehicule;
    this.isModalOpen = true;
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
}
