import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
  message: string;
  token: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl =
    'https://elghandoura-auth-yu0fp5w6.b4a.run/auth';

  signup(data: SignupData): Observable<AuthResponse> {
    const body = new URLSearchParams();

    body.set('name', data.name);
    body.set('email', data.email);
    body.set('password', data.password);
    body.set('phone', data.phone);

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/signup`,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  }

  login(data: LoginData): Observable<AuthResponse> {
    const body = new URLSearchParams();

    body.set('email', data.email);
    body.set('password', data.password);

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/profile`
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return payload.role || null;
    } catch {
      return null;
    }
  }
}