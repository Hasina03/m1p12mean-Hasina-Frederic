import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent  {
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  token: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute,private router: Router) {
    this.token = this.route.snapshot.queryParams['token'];
  }

  onResetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = "Les mots de passe ne correspondent pas.";
      return;
    }
    console.log(this.newPassword);
    console.log(this.confirmPassword);
    console.log(this.token);

    const payload = {
      token: this.token,
      newPassword: this.newPassword
    };

    this.http.post('http://localhost:5000/reset-password/reset-password', payload ,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  .subscribe(
    (response: any) => {
      this.message = response.message;
      setTimeout(() => {
        this.router.navigate(['login']);
      }, 1000);
    },
    (error) => {
      console.error("Erreur API :", error);
      this.message = 'Erreur lors de la réinitialisation du mot de passe.';
    }
  );
  }


}
