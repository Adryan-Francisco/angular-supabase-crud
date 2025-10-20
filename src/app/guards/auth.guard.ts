import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SupabaseService } from "../services/supabase.service";

@Injectable({ providedIn: "root" })
export class AuthGuard {
  constructor(private supabase: SupabaseService, private router: Router) {}

  canActivate(): boolean {
    const user = this.supabase.user();

    if (user) {
      return true;
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
