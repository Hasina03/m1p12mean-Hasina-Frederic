import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DefaultLayoutService } from '../../../services/layouts/default-layout/default-layout.service';
import { AuthService } from '../../../services/authentification/auth.service';

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
  isAuthenticated = false;


  constructor(private defaultLayoutService: DefaultLayoutService,private authService: AuthService,private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;
    this.defaultLayoutService.getPrestations().subscribe(data => {
      this.prestations = data.map((prestation: any) => ({
        _id: prestation._id,
        nom: prestation.nom
      }));
    });

    this.checkAuth2();
    window.addEventListener('storage', this.checkAuth2.bind(this));
  }


  checkAuth() {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      this.router.navigate(['/listepiece']);
    } else {
      this.router.navigate(['/login']);
    }
  }

    checkAuth2() {
      this.isAuthenticated = !!localStorage.getItem('token');
    }

    logout(): void {
      localStorage.removeItem('token');
      this.checkAuth2();
      this.router.navigate(['/']);
    }

}
