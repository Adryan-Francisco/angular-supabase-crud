import { Injectable, signal } from "@angular/core";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { Product } from "../models/product";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class SupabaseService {
  private supabase: SupabaseClient;

  // Produtos
  products = signal<Product[]>([]);

  // Usuário logado
  user = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    // Inicializa usuário da sessão atual
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.user.set(session?.user ?? null);
    });

    // Observa mudanças de autenticação
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ?? null);
    });
  }

  // -------------------------
  // Auth
  // -------------------------

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    this.user.set(data.user);
    return data.user;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.user.set(null);
  }

  // -------------------------
  // Produtos (CRUD)
  // -------------------------

  async loadProducts() {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Erro ao carregar produtos:", error);
      throw error;
    }

    // Cria um novo array para forçar a detecção de mudanças
    this.products.set([...(data as Product[])]);
    console.log("Produtos carregados:", data?.length);
  }

  async addProduct(product: Product) {
    try {
      const { error } = await this.supabase.from("products").insert([product]);
      if (error) {
        console.error("Erro ao adicionar produto:", error);
        throw error;
      }
      console.log("Produto adicionado, recarregando lista...");
      await this.loadProducts();
    } catch (error) {
      console.error("Erro na operação addProduct:", error);
      throw error;
    }
  }

  async updateProduct(id: number, updates: Partial<Product>) {
    try {
      const { error } = await this.supabase
        .from("products")
        .update(updates)
        .eq("id", id);
      if (error) {
        console.error("Erro ao atualizar produto:", error);
        throw error;
      }
      console.log("Produto atualizado, recarregando lista...");
      await this.loadProducts();
    } catch (error) {
      console.error("Erro na operação updateProduct:", error);
      throw error;
    }
  }

  async deleteProduct(id: number) {
    try {
      const { error } = await this.supabase
        .from("products")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Erro ao deletar produto:", error);
        throw error;
      }
      console.log("Produto deletado, recarregando lista...");
      await this.loadProducts();
    } catch (error) {
      console.error("Erro na operação deleteProduct:", error);
      throw error;
    }
  }
}
