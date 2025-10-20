import { Component, OnInit, inject, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { SupabaseService } from "../services/supabase.service";
import { Product } from "../models/product";
import { ProductDialogComponent } from "../product-dialog/product-dialog.component";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = [
    "image",
    "name",
    "description",
    "price",
    "actions",
  ];

  // Computed signal para garantir reatividade
  products = computed(() => this.supabaseService.products());

  constructor(
    private supabaseService: SupabaseService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.supabaseService.loadProducts();
  }

  async onLogout() {
    try {
      await this.supabaseService.logout();
      this.router.navigate(["/login"]);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  openDialog(product?: Product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: "500px",
      data: {
        product: product
          ? { ...product }
          : { name: "", description: "", price: 0, imageUrl: "" },
      },
    });

    dialogRef.afterClosed().subscribe(async (result: Product) => {
      if (result) {
        try {
          if (product?.id) {
            console.log("Atualizando produto:", product.id);
            await this.supabaseService.updateProduct(product.id, result);
          } else {
            console.log("Adicionando novo produto");
            await this.supabaseService.addProduct({
              ...result,
              createdAt: new Date().toISOString(),
            });
          }
          console.log("Operação concluída com sucesso");
        } catch (error) {
          console.error("Erro ao salvar produto:", error);
          alert(
            "Erro ao salvar produto. Verifique o console para mais detalhes."
          );
        }
      }
    });
  }

  async deleteProduct(id: number) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        console.log("Deletando produto:", id);
        await this.supabaseService.deleteProduct(id);
        console.log("Produto deletado com sucesso");
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
        alert(
          "Erro ao deletar produto. Verifique o console para mais detalhes."
        );
      }
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = "https://via.placeholder.com/60?text=Sem+Imagem";
  }
}
