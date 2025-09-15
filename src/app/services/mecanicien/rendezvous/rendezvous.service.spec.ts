import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RendezvousService, RendezVous, RendezVousResponse } from './rendezvous.service';

describe('RendezvousService', () => {
  let service: RendezvousService;
  let httpMock: HttpTestingController;

  const mockRendezVous: RendezVous = {
    id: '64f8a1b2c3d4e5f6a7b8c9d0',
    client: {
      nom_complet: 'Jean Dupont',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.com',
      telephone: '0123456789'
    },
    vehicule: 'Peugeot 308 (2020) - essence',
    date_rdv: '2025-09-15T09:00:00.000Z',
    statut: 'En attente',
    prestations: [
      {
        id: '64f8a1b2c3d4e5f6a7b8c9d1',
        prestation: {
          nom: 'Vidange moteur',
          description: 'Changement de l\'huile moteur et du filtre à huile',
          prix_main_oeuvre: 45
        },
        statuts: {
          En_attente: new Date('2025-09-14T08:00:00.000Z')
        },
        statut_actuel: 'En attente'
      }
    ],
    mecanicien_id: '64f8a1b2c3d4e5f6a7b8c9d2'
  };

  const mockResponse: RendezVousResponse = {
    success: true,
    message: 'Rendez-vous récupérés avec succès',
    data: [mockRendezVous],
    count: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RendezvousService]
    });
    service = TestBed.inject(RendezvousService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRendezVous', () => {
    it('should return an Observable<RendezVous[]>', () => {
      service.getRendezVous().subscribe(rendezVous => {
        expect(rendezVous).toEqual([mockRendezVous]);
        expect(rendezVous.length).toBe(1);
        expect(rendezVous[0].client.nom_complet).toBe('Jean Dupont');
      });

      const req = httpMock.expectOne('/mecanicien/rendez-vous');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error response', () => {
      const errorMessage = 'Erreur serveur';

      service.getRendezVous().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('/mecanicien/rendez-vous');
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getRendezVousWithMeta', () => {
    it('should return complete response with metadata', () => {
      service.getRendezVousWithMeta().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.success).toBe(true);
        expect(response.count).toBe(1);
        expect(response.data.length).toBe(1);
      });

      const req = httpMock.expectOne('/mecanicien/rendez-vous');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('commencerReparation', () => {
    it('should start repair without prestationId', () => {
      const mockCommencerResponse = {
        success: true,
        message: 'Réparation démarrée avec succès',
        data: {
          rendezVous: mockRendezVous,
          prestationDemarree: {
            id: '64f8a1b2c3d4e5f6a7b8c9d1',
            nom: 'Vidange moteur',
            dateDebutEffective: '2025-09-14T10:30:00.000Z',
            statut_precedent: 'En attente',
            statut_actuel: 'En cours'
          }
        }
      };

      const rdvId = '64f8a1b2c3d4e5f6a7b8c9d0';

      service.commencerReparation(rdvId).subscribe(response => {
        expect(response).toEqual(mockCommencerResponse);
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`/mecanicien/rendez-vous/${rdvId}/commencer`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockCommencerResponse);
    });

    it('should start repair with specific prestationId', () => {
      const mockCommencerResponse = {
        success: true,
        message: 'Réparation démarrée avec succès',
        data: {
          rendezVous: mockRendezVous,
          prestationDemarree: {
            id: '64f8a1b2c3d4e5f6a7b8c9d1',
            nom: 'Vidange moteur',
            dateDebutEffective: '2025-09-14T10:30:00.000Z',
            statut_precedent: 'En attente',
            statut_actuel: 'En cours'
          }
        }
      };

      const rdvId = '64f8a1b2c3d4e5f6a7b8c9d0';
      const prestationId = '64f8a1b2c3d4e5f6a7b8c9d1';

      service.commencerReparation(rdvId, prestationId).subscribe(response => {
        expect(response).toEqual(mockCommencerResponse);
      });

      const req = httpMock.expectOne(`/mecanicien/rendez-vous/${rdvId}/commencer`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ prestationId });
      req.flush(mockCommencerResponse);
    });
  });

  describe('getRendezVousById', () => {
    it('should return a specific rendez-vous', () => {
      const rdvId = '64f8a1b2c3d4e5f6a7b8c9d0';

      service.getRendezVousById(rdvId).subscribe(rendezVous => {
        expect(rendezVous).toEqual(mockRendezVous);
      });

      const req = httpMock.expectOne(`/mecanicien/rendez-vous/${rdvId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRendezVous);
    });
  });
});
