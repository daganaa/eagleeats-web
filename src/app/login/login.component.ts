import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async onSubmit() {
    if (this.isLoading) {
      return; // Prevent multiple submissions
    }
    
    if (this.email && this.password) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const result = await this.supabaseService.signInWithEmail(this.email, this.password);
      
      if (result.success) {
        this.successMessage = 'Login successful! Redirecting...';
        // Refresh the page to update auth state
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        this.errorMessage = result.error || 'Invalid email or password. Please try again.';
      }
      
      this.isLoading = false;
    } else {
      this.errorMessage = 'Please fill in both email and password fields.';
    }
  }
}