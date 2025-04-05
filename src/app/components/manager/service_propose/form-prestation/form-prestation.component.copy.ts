import { Component, OnInit } from '@angular/core';
import { PrestationService } from '../../../../services/manager/service_propose/prestation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-prestation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-prestation.component.html',
  styleUrl: './form-prestation.component.css'
})
export class FormPrestationComponent implements OnInit {
  prestation: any = {
    nom: '',
    description: '',
    prix_main_oeuvre: null,
    processus: []
  };
  pieces: any[] = [];
  isEditing = false;

  constructor(
    private prestationService: PrestationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.prestationService.getPrestationById(id).subscribe(
        data => this.prestation = data,
        error => console.error('Erreur lors du chargement de la prestation', error)
      );
    }
    this.loadPieces();
  }

  loadPieces(): void {
    this.prestationService.getPieces().subscribe(
      data => this.pieces = data,
      error => console.error('Erreur lors du chargement des pièces', error)
    );
  }

  addEtape() {
    this.prestation.processus.push({
      ordre: this.prestation.processus.length + 1,
      nom_etape: '',
      pieces_possibles: []
    });
  }

  removeEtape(index: number) {
    this.prestation.processus.splice(index, 1);
  }


  addProcessus(): void {
    this.prestation.processus.push({ ordre: this.prestation.processus.length + 1, nom_etape: '', pieces_possibles: [] });
  }

  removeProcessus(index: number): void {
    this.prestation.processus.splice(index, 1);
  }

  submit(): void {
    if (this.isEditing) {
      this.prestationService.updatePrestation(this.prestation._id, this.prestation).subscribe(
        () => this.router.navigate(['/manager/prestations']),
        error => console.error('Erreur lors de la mise à jour', error)
      );
    } else {
      this.prestationService.createPrestation(this.prestation).subscribe(
        () => this.router.navigate(['/manager/prestations']),
        error => console.error('Erreur lors de la création', error)
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/manager/prestations']);
  }
}
