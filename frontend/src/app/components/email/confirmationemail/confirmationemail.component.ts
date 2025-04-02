import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmationemail',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './confirmationemail.component.html',
  styleUrl: './confirmationemail.component.css'
})
export class ConfirmationemailComponent {
  email: string = '';
  message: string = '';
  resetLink: string = ''; 

  constructor(private http: HttpClient) {}

  onForgotPassword() {
    this.http.post<{ resetLink: string }>('http://localhost:5000/forgot-password/forgot-password', { email: this.email })
      .subscribe(
        (response) => {
          console.log(this.resetLink);
          this.resetLink = response.resetLink;
          this.message = 'Un lien de réinitialisation a été envoyé à votre email.';
        },
        (error) => {
          this.message = 'Erreur lors de l\'envoi du lien.';
        }
      );
  }

  redirectToReset() {
    if (this.resetLink) {
      console.log(this.resetLink);
      window.location.href = this.resetLink;
    }
  }

}
