import { Component } from '@angular/core';
import { RendezvousService } from '../../services/rendez_vous/rendezvous.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../services/utilisateur.service';
import { ListprestationService } from '../../services/prestation/listprestation.service';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  imports:  [CommonModule, FormsModule],
  templateUrl: './rendez-vous.component.html',
  styleUrl: './rendez-vous.component.css'
})
export class RendezVousComponent {

rendezVous = {
  client_id: '',
  vehicule_id: {
    modele: '',
    annee: null as number | null,
    marque: '',
    type: '' as string | null,
    type_moteur: '',
    type_autre: ''
  },
  date_rdv: '',
  prestations: [] as { prestation_id: string }[]
};

  prestationsList: any[] = [];

  messageSuccess = '';
  messageError = '';
  selectedTypeId: string = '';
  autreTypeVehicule: string = '';
  typesVehicule: any[] = [];

  constructor(private rendezVousService: RendezvousService,private utilisateurservice:UtilisateurService,private prestationService:ListprestationService) {}
  ngOnInit() {
    const clientId  = this.utilisateurservice.getUserIdFromToken();
    if (clientId) {
      this.loadTypesVehicule();
      this.rendezVous.client_id = clientId?.id;
    } else {
      console.error("Erreur : Impossible de récupérer l'ID du client");
    }
    this.loadPrestations();
  }

  loadTypesVehicule() {
    this.rendezVousService.getTypesVehicule().subscribe(
      (data) => {
        this.typesVehicule = data.typesVehicules;
      },
      (error) => {
        console.error('Erreur lors du chargement des types de véhicules', error);
      }
    );
  }


  loadPrestations() {
    this.prestationService.getprestation().subscribe(
      (data) => {
        this.prestationsList = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des prestations', error);
      }
    );
  }

  togglePrestation(prestationId: string) {
      const index = this.rendezVous.prestations.findIndex(p => p.prestation_id === prestationId);

   if (index === -1) {
    this.rendezVous.prestations.push({ prestation_id: prestationId });
  } else {
    this.rendezVous.prestations.splice(index, 1);
  }
 console.log('Prestations sélectionnées:', this.rendezVous.prestations);
}
onSubmit() {
  // Vérifie la date
  const dateRdv = new Date(this.rendezVous.date_rdv);
  const currentDate = new Date();
  if (dateRdv < currentDate) {
    this.messageError = 'La date du rendez-vous ne peut pas être dans le passé ❌';
    this.messageSuccess = '';
    return;
  }

// Assigner le type de véhicule
if (this.selectedTypeId === 'autre' && this.autreTypeVehicule.trim() !== '') {
  this.rendezVous.vehicule_id.type = null;                  // TypeVehicule ObjectId vide
  this.rendezVous.vehicule_id.type_autre = this.autreTypeVehicule.trim();
} else {
  const typeSelectionne = this.typesVehicule.find(t => t._id === this.selectedTypeId);
  if (typeSelectionne) {
    this.rendezVous.vehicule_id.type = typeSelectionne._id;
    this.rendezVous.vehicule_id.type_autre = '';             // Toujours envoyer un string vide
  } else {
    // Cas où aucun type n'est choisi
    this.rendezVous.vehicule_id.type = null;
    this.rendezVous.vehicule_id.type_autre = '';
  }
}


  this.rendezVousService.addRendezVous(this.rendezVous).subscribe(
    response => {
      this.messageSuccess = 'Rendez-vous ajouté avec succès ✅';
      this.messageError = '';
      console.log('Rendez-vous créé', response);
    },
    error => {
      console.error('Erreur lors de la création du rendez-vous', error);
      this.messageError = 'Erreur lors de l\'ajout du rendez-vous ❌';
        this.messageSuccess = '';
      }
    );
  }
}
