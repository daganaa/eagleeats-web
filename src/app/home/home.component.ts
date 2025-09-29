import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = false;
  userEmail: string | null = null;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    // Check auth state immediately
    setTimeout(() => {
      this.checkAuthStatus();
    }, 100);
    
    // Set up interval to check auth state periodically
    setInterval(() => {
      this.checkAuthStatus();
    }, 2000);
  }

  private checkAuthStatus() {
    const currentAuthStatus = this.supabaseService.isAuthenticated();
    const currentUserEmail = this.supabaseService.getUserEmail();
    
    // Only update if there's a change to prevent unnecessary re-renders
    if (this.isAuthenticated !== currentAuthStatus || this.userEmail !== currentUserEmail) {
      this.isAuthenticated = currentAuthStatus;
      this.userEmail = currentUserEmail;
      console.log('Auth status changed:', this.isAuthenticated, 'User:', this.userEmail);
    }
  }

  async logout() {
    const result = await this.supabaseService.signOut();
    if (result.success) {
      this.checkAuthStatus(); // Update UI
    }
  }
}
