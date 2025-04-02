import { Component, OnInit } from '@angular/core';
import { AccueilService } from '../../../services/client/accueil/accueil.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {

  prestations: any[] = [];

  constructor(private prestationService: AccueilService) {}

  ngOnInit(): void {
    this.prestationService.getPrestations().subscribe(
      (data) => { this.prestations = data; },
      (error) => { console.error("Erreur lors du chargement des prestations", error); }
    );
  }
}
