import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  confirmEmail: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private supabaseService: SupabaseService) {}

  async onSubmit() {
    if (this.isLoading) {
      return; // Prevent multiple submissions
    }
    
    if (this.email && this.confirmEmail && this.email === this.confirmEmail) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const result = await this.supabaseService.resetPassword(this.email);
      
      if (result.success) {
        this.successMessage = 'Password reset instructions have been sent to your email address. Check your inbox and follow the link to reset your password.';
      } else {
        this.errorMessage = result.error || 'An error occurred. Please try again.';
      }
      
      this.isLoading = false;
    } else if (this.email !== this.confirmEmail) {
      this.errorMessage = 'Email addresses do not match. Please try again.';
    } else {
      this.errorMessage = 'Please fill in both email fields.';
    }
  }
}

