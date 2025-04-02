import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DefaultLayoutService } from '../../../services/layouts/default-layout/default-layout.service';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.css'
})
export class DefaultLayoutComponent implements OnInit {
  prestations: any[] = [];
  isDropdownOpen = false;

  constructor(private defaultLayoutService: DefaultLayoutService) {}

  ngOnInit(): void {
    this.defaultLayoutService.getPrestations().subscribe(data => {
      this.prestations = data.map((prestation: any) => ({
        _id: prestation._id,
        nom: prestation.nom
      }));
    });
  }

}
