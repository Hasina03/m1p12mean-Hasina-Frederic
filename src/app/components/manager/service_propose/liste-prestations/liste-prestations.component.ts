import { Component, OnInit } from '@angular/core';
import { PrestationService } from '../../../../services/manager/service_propose/prestation.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-liste-prestations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-prestations.component.html',
  styleUrl: './liste-prestations.component.css'
})
export class ListePrestationsComponent implements OnInit {
  prestations: any[] = [];

  constructor(private prestationService: PrestationService, private router: Router) {}

  ngOnInit(): void {
    this.loadPrestations();
  }

  loadPrestations(): void {
    this.prestationService.getPrestations().subscribe((data: any) => {
      this.prestations = data;
    });
  }

  navigateToAddForm(): void {
    this.router.navigate(['/manager/prestations/add']);
  }

  navigateToEditForm(id: string): void {
    this.router.navigate([`/manager/prestations/edit/${id}`]);
  }

  deletePrestation(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette prestation ?')) {
      this.prestationService.deletePrestation(id).subscribe(() => {
        alert('Prestation supprimée avec succès');
        this.loadPrestations();
      });
    }
  }
}
