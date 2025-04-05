import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { VehiculeService } from '../../../../services/vehicule/vehicule.service';

@Component({
  selector: 'app-listevehicule',
  standalone: true,
  imports: [CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './listevehicule.component.html',
  styleUrl: './listevehicule.component.css'
})
export class ListevehiculeComponent {
  vehicules: any[] = [];
  filteredVehicules: any[] = [];
  searchTerm: string = '';
  page: number = 1;
  itemsPerPage: number = 7;

  constructor(private vehiculeService: VehiculeService) {}

  ngOnInit() {
    this.fetchVehicules();
  }

  fetchVehicules() {
    this.vehiculeService.getvehicule().subscribe(
      data => {
        this.vehicules = data;
        this.filteredVehicules = data;
      },
      error => console.error('Erreur lors de la récupération des véhicules', error)
    );
  }

  onSearchTermChange() {
    this.filteredVehicules = this.vehicules.filter(v =>
      v.marque.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      v.modele.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
  }

  deleteVehicule(id: string) {
    this.vehiculeService.deletevehicule(id).subscribe(
      () => {
        this.vehicules = this.vehicules.filter(v => v._id !== id);
        this.onSearchTermChange();
      },
      error => console.error('Erreur lors de la suppression du véhicule', error)
    );
  }
}
