import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: { role: 'admin' | 'user' } | null = null;

  login(role: 'admin' | 'user') {
    this.currentUser = { role };
  }

  logout() {
    this.currentUser = null;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  getRole(): 'admin' | 'user' | null {
    return this.currentUser?.role || null;
  }
}