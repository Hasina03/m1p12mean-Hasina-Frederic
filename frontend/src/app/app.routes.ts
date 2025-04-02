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

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'rendezvous', component:RendezVousComponent  },
    { path: 'users', component: InscriptionComponent },
    { path: '', redirectTo: 'acceuil', pathMatch: 'full' },
    {
        path: '',
        component: DefaultLayoutComponent,
        children: [
          { path: 'acceuil', component: AccueilComponent },
          { path: 'prestation/:id', component: PrestationDetailComponent },
          { path: 'rendez-vous/:id/avis', component: AvisComponent },
          { path: 'rendez-vous/:id/suivi-prestations', component: SuiviPrestationComponent }
        ]
      },
    // { path: 'acceuil', component: AccueilComponent },
    // { path: 'rendez-vous/:id/avis', component: AvisComponent },
    // { path: 'rendez-vous/:id/suivi-prestations', component: SuiviPrestationComponent },
    { path: 'mecanicien/rendez-vous', component: RendezvousListComponent },
    { path: 'mecanicien/rendez-vous/:id', component: RendezvousDetailsComponent},
    { path: 'manager/prestations', component: ListePrestationsComponent },
    { path: 'manager/prestations/add', component: FormPrestationComponent },
    { path: 'manager/prestations/edit/:id', component: FormPrestationComponent }
 ];

