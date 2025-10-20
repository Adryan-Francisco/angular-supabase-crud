import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container">
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .container {
        min-height: 100vh;
      }
    `,
  ],
})
export class AppComponent {
  title = "angular-supabase-dashboard";
}
