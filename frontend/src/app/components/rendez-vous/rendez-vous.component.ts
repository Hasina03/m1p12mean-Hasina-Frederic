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
      annee: null,
      marque: '',
      type: '',
      type_moteur:''
    },
    date_rdv: '',
    prestations: [] as { prestation_id: string }[]
  };

  prestationsList: any[] = [];

  messageSuccess = '';
  messageError = '';

  constructor(private rendezVousService: RendezvousService,private utilisateurservice:UtilisateurService,private prestationService:ListprestationService) {}
  ngOnInit() {
    const clientId  = this.utilisateurservice.getUserIdFromToken();
    if (clientId) {
      this.rendezVous.client_id = clientId?.id;
    } else {
      console.error("Erreur : Impossible de récupérer l'ID du client");
    }
    this.loadPrestations();
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
    const index = this.rendezVous.prestations.findIndex(prestation => prestation.prestation_id === prestationId);

    if (index === -1) {
      this.rendezVous.prestations.push({prestation_id:prestationId});
    } else {
      this.rendezVous.prestations.splice(index, 1);
    }

    console.log('Prestations sélectionnées:', this.rendezVous.prestations);
  }


  onSubmit() {
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
