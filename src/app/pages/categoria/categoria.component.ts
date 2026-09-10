import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Categoria {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-categoria',
  imports: [FormsModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
})
export class CategoriaComponent {
  categoriaAtual: Categoria = { id: 0, nome: '' };
  listaCategorias: Categoria[] = [];

  salvarCategoria(): void {
    const nome = this.categoriaAtual.nome.trim();

    if (!nome) {
      return;
    }

    if (this.categoriaAtual.id === 0) {
      const novoId = this.listaCategorias.length === 0
        ? 1
        : Math.max(...this.listaCategorias.map(categoria => categoria.id)) + 1;

      this.listaCategorias.push({ id: novoId, nome });
    } else {
      const categoria = this.listaCategorias.find(item => item.id === this.categoriaAtual.id);
      if (categoria) {
        categoria.nome = nome;
      }
    }

    this.categoriaAtual = { id: 0, nome: '' };
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaAtual = { ...categoria };
  }

  excluirCategoria(id: number): void {
    this.listaCategorias = this.listaCategorias.filter(categoria => categoria.id !== id);

    if (this.categoriaAtual.id === id) {
      this.categoriaAtual = { id: 0, nome: '' };
    }
  }
}

