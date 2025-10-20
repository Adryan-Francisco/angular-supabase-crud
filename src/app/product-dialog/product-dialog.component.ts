import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Product } from "../models/product";

@Component({
  selector: "app-product-dialog",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./product-dialog.component.html",
  styleUrls: ["./product-dialog.component.css"],
})
export class ProductDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data.product);
  }

  getImageUrl(): string {
    // Adiciona timestamp para forçar atualização e evitar cache
    const url = this.data.product.imageUrl || "";
    if (!url) return "";

    // Se a URL já tem parâmetros, usa &, senão usa ?
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${Date.now()}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = "https://via.placeholder.com/150?text=Imagem+Indisponível";
  }
}
