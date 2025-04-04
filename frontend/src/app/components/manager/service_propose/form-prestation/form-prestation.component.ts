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
    prix_main_oeuvre: 0,
    processus: []
  };

  pieces: any[] = [];
  isEditing: boolean = false;
  prestationId: string | null = null;

  showModal = false;
  newProcessus: any = {
    nom_etape: '',
    pieces_possibles: []
  };

  constructor(
    private prestationService: PrestationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prestationId = this.route.snapshot.paramMap.get('id');
    if (this.prestationId) {
      this.isEditing = true;
      this.prestationService.getPrestationById(this.prestationId).subscribe((data) => {
        this.prestation = data;
      });
    }

    this.prestationService.getPieces().subscribe((data) => {
      this.pieces = data;
    });
  }

  openModal() {
    this.newProcessus = {
      nom_etape: '',
      pieces_possibles: []
    };
    this.showModal = true;
  }

  togglePieceSelection(pieceId: string) {
    const index = this.newProcessus.pieces_possibles.indexOf(pieceId);
    if (index === -1) {
      this.newProcessus.pieces_possibles.push(pieceId);
    } else {
      this.newProcessus.pieces_possibles.splice(index, 1);
    }
  }

  confirmAddProcessus() {
    const newProc = {
      ordre: this.prestation.processus.length + 1,
      nom_etape: this.newProcessus.nom_etape,
      pieces_possibles: [...this.newProcessus.pieces_possibles]
    };
    this.prestation.processus.push(newProc);
    this.showModal = false;
  }

  removeProcessus(index: number) {
    this.prestation.processus.splice(index, 1);
  }

  submitForm() {
    if (this.isEditing) {
      this.prestationService.updatePrestation(this.prestationId!, this.prestation).subscribe(() => {
        this.router.navigate(['/manager/dashboard']);
      });
    } else {
      this.prestationService.createPrestation(this.prestation).subscribe(() => {
        this.router.navigate(['/manager/dashboard']);
      });
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
