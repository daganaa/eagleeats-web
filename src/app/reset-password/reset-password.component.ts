import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  isTokenValid: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is authenticated and has password reset token
    const user = this.supabaseService.getCurrentUser();
    if (user) {
      this.isTokenValid = true;
    } else {
      this.errorMessage = 'Invalid or expired reset link. Please request a new password reset.';
    }
  }

  async onSubmit() {
    if (this.newPassword && this.confirmPassword && this.newPassword === this.confirmPassword) {
      if (this.newPassword.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters long.';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const result = await this.supabaseService.updatePassword(this.newPassword);
      
      if (result.success) {
        this.successMessage = 'Password updated successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      } else {
        this.errorMessage = result.error || 'An error occurred while updating your password.';
      }
      
      this.isLoading = false;
    } else if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please try again.';
    } else {
      this.errorMessage = 'Please fill in both password fields.';
    }
  }
}
