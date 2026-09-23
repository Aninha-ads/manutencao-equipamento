import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service'; 
import { Categoria } from '../../models/categoria.model'; 

@Component({
  selector: 'app-categoria',
  imports: [FormsModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
})
export class CategoriaComponent implements OnInit {
  categoriaAtual: Categoria = { id: 0, nome: '' };
  listaCategorias: Categoria[] = [];

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (dados) => (this.listaCategorias = dados),
      error: (erro) => console.error('Erro ao carregar categorias', erro),
    });
  }

  salvarCategoria(): void {
    if (!this.categoriaAtual.nome.trim()) return;

    this.categoriaService.salvarCategoria(this.categoriaAtual).subscribe({
      next: () => {
        this.carregarCategorias(); 
        this.categoriaAtual = { id: 0, nome: '' }; 
      },
      error: (erro) => console.error('Erro ao salvar categoria', erro),
    });
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaAtual = { ...categoria };
  }

  excluirCategoria(id: number): void {
    this.categoriaService.excluirCategoria(id).subscribe({
      next: () => {
        this.carregarCategorias();
        if (this.categoriaAtual.id === id) {
          this.categoriaAtual = { id: 0, nome: '' };
        }
      },
      error: (erro) => console.error('Erro ao excluir categoria', erro),
    });
  }
}