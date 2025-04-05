import { Component, OnInit } from '@angular/core';
import { RendezvousService } from '../../../services/mecanicien/rendezvous/rendezvous.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rendezvous-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rendezvous-list.component.html',
  styleUrl: './rendezvous-list.component.css'
})
export class RendezvousListComponent implements OnInit {
  rendezVousList: any[] = [];

  constructor(private rendezvousService: RendezvousService, private router: Router) {}

  ngOnInit(): void {
    this.rendezvousService.getRendezVous().subscribe(data => {
      this.rendezVousList = data;
    });
  }

  viewDetails(id: string): void {
    this.router.navigate(['/rendezvous', id]);
  }
}
