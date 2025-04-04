import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { RendezVousComponent } from './components/rendez-vous/rendez-vous.component';
import { AccueilComponent } from './components/client/accueil/accueil.component';
import { ListePrestationsComponent } from './components/manager/service_propose/liste-prestations/liste-prestations.component';
import { FormPrestationComponent } from './components/manager/service_propose/form-prestation/form-prestation.component';
import { AvisComponent } from './components/client/avis/avis/avis.component';
import { SuiviPrestationComponent } from './components/client/suivi-prestation/suivi-prestation/suivi-prestation.component';
import { RendezvousListComponent } from './components/mecanicien/rendezvous-list/rendezvous-list.component';
import { RendezvousDetailsComponent } from './components/mecanicien/rendezvous-details/rendezvous-details.component';
import { DefaultLayoutComponent } from './components/layouts/default-layout/default-layout.component';
import { PrestationDetailComponent } from './components/client/prestation-detail/prestation-detail.component';
import { ManagerComponent } from './components/manager/manager.component';
import { ListeUtilisateurComponent } from './components/manager/tableau/liste-utilisateur/liste-utilisateur.component';
import { ListeRendezvousComponent } from './components/manager/tableau/liste-rendezvous/liste-rendezvous.component';
import { PieceComponent } from './components/stock/piece/piece.component';
import { VehiculeComponent } from './components/vehicule/vehicule/vehicule.component';
import { ListevehiculeComponent } from './components/manager/tableau/listevehicule/listevehicule.component';
import { ListepieceComponent } from './components/manager/tableau/listepiece/listepiece.component';
import { LayoutComponent } from './components/layouts/mecanicien-layout/layout/layout.component';
import { DevisSelectionComponent } from './components/client/devis-selection/devis-selection.component';
import { DevisAffichageComponent } from './components/client/devis-affichage/devis-affichage.component';
import { AuthGuard } from './auth.guard';
import { ConfirmationemailComponent } from './components/email/confirmationemail/confirmationemail.component';
import { ResetPasswordComponent } from './components/email/reset-password/reset-password.component';
import { DashboardComponent } from './components/manager/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },

    { path: 'confirmationemail', component:ConfirmationemailComponent  },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'users', component: InscriptionComponent },
    { path: '', redirectTo: 'acceuil', pathMatch: 'full' },

    {
        path: '',
        component: DefaultLayoutComponent,
        children: [
          { path: 'acceuil', component: AccueilComponent },
          { path: 'listepiece', component:ListepieceComponent , canActivate: [AuthGuard] },
          { path: 'prestation/:id', component: PrestationDetailComponent },
          { path: 'rendez-vous/:id/avis', component: AvisComponent },
          { path: 'rendez-vous/:id/suivi-prestations', component: SuiviPrestationComponent },
          { path: 'devis-select', component: DevisSelectionComponent },
          { path: 'devis-affichage', component: DevisAffichageComponent },
          { path: 'rendezvous', component:RendezVousComponent ,canActivate: [AuthGuard] }
        ]
      },
    // { path: 'acceuil', component: AccueilComponent },
    // { path: 'rendez-vous/:id/avis', component: AvisComponent },
    // { path: 'rendez-vous/:id/suivi-prestations', component: SuiviPrestationComponent },
    // { path: 'mecanicien/rendez-vous', component: RendezvousListComponent },
    // { path: 'mecanicien/rendez-vous/:id', component: RendezvousDetailsComponent},
    // { path: 'manager/prestations', component: ListePrestationsComponent },
    // { path: 'manager/prestations/add', component: FormPrestationComponent },
    // { path: 'manager/prestations/edit/:id', component: FormPrestationComponent },
    // { path: 'manager/dashboard', component: DashboardComponent },
    { path: 'manager/prestations', component: ListePrestationsComponent },
    { path: 'manager/prestations/add', component: FormPrestationComponent },
    { path: 'manager/prestations/edit/:id', component: FormPrestationComponent },


    { path: 'rendezvous', component:RendezVousComponent,canActivate: [AuthGuard]  },

    {
      path: 'manager',
      component: ManagerComponent,
      children: [
        { path: 'listeUtilisateur', component:ListeUtilisateurComponent  },
        { path: 'listerendezvous', component:ListeRendezvousComponent  },
        { path: 'stockpiece', component:PieceComponent  },
        { path: 'ajoutvehicule', component:VehiculeComponent  },
        { path: 'listevehicule', component:ListevehiculeComponent  },
        { path: 'ajoutpiece', component:PieceComponent  },
        // { path: 'prestations', component: ListePrestationsComponent },
        // { path: 'prestations/add', component: FormPrestationComponent },
        // { path: 'prestations/edit/:id', component: FormPrestationComponent },
        { path: 'dashboard', component: DashboardComponent },
      ]
  },
  {
    path: 'mecanicien', component: LayoutComponent,
    children: [
      { path: 'rendez-vous', component: RendezvousListComponent },
      { path: 'rendez-vous/:id', component: RendezvousDetailsComponent}
    ]
  }

 ];

