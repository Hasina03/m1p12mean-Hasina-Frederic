import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface RendezVous {
  id: string;
  client: {
    nom_complet: string;
    nom: string;
    prenom: string;
    email?: string;
    telephone?: string;
  };
  vehicule: string;
  date_rdv: string;
  statut: string;
  prestations: Array<{
    id: string;
    prestation: {
      nom: string;
      description?: string;
      prix_main_oeuvre?: number;
    };
    statuts: {
      En_attente?: Date;
      En_cours?: Date;
      Annulé?: Date;
      Terminé?: Date;
    };
    statut_actuel: string;
  }>;
  mecanicien_id?: string;
  progression?: number;
}

export interface RendezVousResponse {
  success: boolean;
  message: string;
  data: RendezVous[];
  count: number;
}

export interface CommencerReparationResponse {
  success: boolean;
  message: string;
  data: {
    rendezVous: any;
    prestationDemarree: {
      id: string;
      nom: string;
      dateDebutEffective: string;
      statut_precedent: string;
      statut_actuel: string;
    };
  };
}

export interface TerminerPrestationResponse {
  success: boolean;
  message: string;
  data: {
    rendezVous: any;
    prestationTerminee: {
      id: string;
      nom: string;
      dateFinEffective: string;
      dureeEffective?: number;
      statut_precedent: string;
      statut_actuel: string;
    };
  };
}

export interface AnnulerPrestationResponse {
  success: boolean;
  message: string;
  data: {
    rendezVous: any;
    prestationAnnulee: {
      id: string;
      nom: string;
      dateAnnulationEffective: string;
      motif?: string;
      statut_precedent: string;
      statut_actuel: string;
    };
  };
}

export interface AjouterPrestationResponse {
  success: boolean;
  message: string;
  data: {
    rendezVous: any;
    prestationAjoutee: {
      id: string;
      nom: string;
      dateAjout: string;
      motif?: string;
      statut_actuel: string;
    };
  };
}

export interface StatsMecanicien {
  success: boolean;
  message: string;
  data: {
    rendezvous: {
      aujourd_hui: number;
      en_cours: number;
      termines: number;
      total: number;
    };
    prestations: {
      total: number;
      terminees: number;
      en_cours: number;
      taux_completion: number;
    };
    temps: {
      total_minutes: number;
      total_heures: number;
      moyenne_par_prestation: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  private apiUrl = `${environment.apiUrl}/mecanicien/rendez-vous`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les headers avec le token d'authentification
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Récupère la liste des rendez-vous du mécanicien connecté
   */
  getRendezVous(): Observable<RendezVous[]> {
    return new Observable(observer => {
      this.http.get<RendezVousResponse>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
        next: (response) => {
          observer.next(response.data);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Récupère la réponse complète des rendez-vous (avec métadonnées)
   */
  getRendezVousWithMeta(): Observable<RendezVousResponse> {
    return this.http.get<RendezVousResponse>(this.apiUrl, { headers: this.getHeaders() });
  }

  /**
   * Démarre une réparation
   */
  commencerReparation(rdvId: string, prestationId?: string): Observable<CommencerReparationResponse> {
    const body = prestationId ? { prestationId } : {};
    return this.http.patch<CommencerReparationResponse>(
      `${this.apiUrl}/${rdvId}/commencer`,
      body,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Termine une prestation spécifique
   */
  terminerPrestation(rdvId: string, prestationId: string): Observable<TerminerPrestationResponse> {
    return this.http.patch<TerminerPrestationResponse>(
      `${this.apiUrl}/${rdvId}/prestations/${prestationId}/terminer`,
      {},
      { headers: this.getHeaders() }
    );
  }

  /**
   * Annule une prestation spécifique
   */
  annulerPrestation(rdvId: string, prestationId: string, motif?: string): Observable<AnnulerPrestationResponse> {
    const body = motif ? { motif } : {};
    return this.http.patch<AnnulerPrestationResponse>(
      `${this.apiUrl}/${rdvId}/prestations/${prestationId}/annuler`,
      body,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Ajoute une nouvelle prestation à un rendez-vous
   */
  ajouterPrestation(rdvId: string, prestationId: string, motif?: string): Observable<AjouterPrestationResponse> {
    const body: any = { prestationId };
    if (motif) {
      body.motif = motif;
    }
    return this.http.post<AjouterPrestationResponse>(
      `${this.apiUrl}/${rdvId}/prestations`,
      body,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Récupère les statistiques du mécanicien connecté
   */
  getStatsMecanicien(): Observable<StatsMecanicien> {
    return this.http.get<StatsMecanicien>(`${this.apiUrl}/stats`, { headers: this.getHeaders() });
  }

  /**
   * Récupère un rendez-vous par son ID
   */
  getRendezVousById(id: string): Observable<RendezVous> {
    return this.http.get<RendezVous>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Récupère toutes les prestations disponibles
   */
  getPrestationsDisponibles(): Observable<any[]> {
    return new Observable(observer => {
      this.http.get<{success: boolean, data: any[]}>(`${this.apiUrl}/prestations`, { headers: this.getHeaders() }).subscribe({
        next: (response) => {
          observer.next(response.data);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}
