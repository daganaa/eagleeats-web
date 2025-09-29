import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private _currentUser: User | null = null;

  constructor() {
    // Replace with your Supabase URL and anon key
    // You can find these in your Supabase project settings
    const supabaseUrl = 'https://qrfkndetqcdjcfejwrqo.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZmtuZGV0cWNkamNmZWp3cnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNjM0MTcsImV4cCI6MjA3MTgzOTQxN30.ar-pu1UgC83IBM85NG-7Y7RmYcRKTwg6vm8xXEIFzkQ';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    
    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this._currentUser = session?.user ?? null;
    });
  }

  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updatePassword(newPassword: string) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      this._currentUser = data.user;
      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signUp(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      this._currentUser = data.user;
      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  isAuthenticated(): boolean {
    return this._currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this._currentUser;
  }

  getUserEmail(): string | null {
    return this._currentUser?.email || null;
  }

  async initializeAuth() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      this._currentUser = user;
      return user;
    } catch (error) {
      this._currentUser = null;
      return null;
    }
  }

  async signOut() {
    try {
      await this.supabase.auth.signOut();
      this._currentUser = null;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  getSupabaseClient() {
    return this.supabase;
  }
}