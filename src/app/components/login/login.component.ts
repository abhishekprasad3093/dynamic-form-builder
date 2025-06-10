import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  role: 'admin' | 'user' = 'user';
  private authService = inject(AuthService);
  private router = inject(Router);

  login() {
    this.authService.login(this.role);
    this.router.navigate(['/forms']);
  }
}