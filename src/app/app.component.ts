import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './services/supabase.service';

declare var AOS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-test';

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    // Initialize auth state when app starts
    this.supabaseService.initializeAuth();

    // Initialize AOS
    import('aos').then(AOS => {
      console.log('AOS loaded:', AOS);
      AOS.init({
        duration: 1000, // Animation duration
        once: false,    // Allow animation to happen multiple times
        offset: 50,     // Smaller offset from viewport
        delay: 100,     // Small delay before animation
        easing: 'ease-in-out'
      });
      console.log('AOS initialized');
    }).catch(error => {
      console.error('Failed to load AOS:', error);
    });
  }
}
