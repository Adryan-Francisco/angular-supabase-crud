import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SupabaseService } from "../../services/supabase.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email = "";
  password = "";
  loading = false;
  hidePassword = true;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async onLogin() {
    if (!this.email || !this.password) {
      alert("Por favor, preencha email e senha!");
      return;
    }

    this.loading = true;
    try {
      await this.supabase.login(this.email, this.password);
      this.router.navigate(["/"]); // redireciona para Home
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
      alert(err.message || "Erro ao fazer login!");
    } finally {
      this.loading = false;
    }
  }
}
