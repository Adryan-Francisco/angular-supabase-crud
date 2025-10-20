import { Component, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { SupabaseService } from "../services/supabase.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  userEmail = computed(() => this.supabase.user()?.email || "Usuário");

  features = [
    {
      icon: "inventory_2",
      title: "Gerenciar Produtos",
      description: "Adicione, edite e remova produtos do seu catálogo",
      route: "/products",
    },
    {
      icon: "analytics",
      title: "Relatórios",
      description: "Visualize estatísticas e análises dos seus produtos",
      route: "/products",
    },
    {
      icon: "settings",
      title: "Configurações",
      description: "Personalize as configurações do sistema",
      route: "/products",
    },
  ];

  constructor(private supabase: SupabaseService, private router: Router) {}

  async onLogout() {
    try {
      await this.supabase.logout();
      this.router.navigate(["/login"]);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }
}
