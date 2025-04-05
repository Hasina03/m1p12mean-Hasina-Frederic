import { Component, OnInit } from '@angular/core';
import { AvisService } from '../../../../services/client/avis/avis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.css'
})
export class AvisComponent implements OnInit {
  rendezVousId: string = '';
  avis: any = { note: null, commentaire: '' };
  isEdit: boolean = false;

  constructor(
    private avisService: AvisService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rendezVousId = this.route.snapshot.paramMap.get('id') || '';
  }

  submitAvis(): void {
    if (this.isEdit) {
      this.avisService.updateAvis(this.rendezVousId, this.avis).subscribe(() => {
        this.router.navigate(['/client/rendez-vous']);
      });
    } else {
      this.avisService.addAvis(this.rendezVousId, this.avis).subscribe(() => {
        this.router.navigate(['/client/rendez-vous']);
      });
    }
  }

  deleteAvis(): void {
    if (confirm("Voulez-vous vraiment supprimer cet avis ?")) {
      this.avisService.deleteAvis(this.rendezVousId).subscribe(() => {
        this.router.navigate(['/client/rendez-vous']);
      });
    }
  }
}
