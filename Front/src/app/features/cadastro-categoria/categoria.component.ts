import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service'; 
import { Categoria } from '../../models/categoria.model'; 
import { InteracaoService } from '../../services/interacao.service';

@Component({
  selector: 'app-categoria',
  imports: [FormsModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
})
export class CategoriaComponent implements OnInit {
  categoriaAtual: Categoria = { id: 0, nome: '' };
  listaCategorias: Categoria[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private interacaoService: InteracaoService
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (dados) => (this.listaCategorias = dados),
      error: () => this.interacaoService.erro('Erro ao carregar categorias.'),
    });
  }

  salvarCategoria(): void {
    if (!this.categoriaAtual.nome.trim()) return;

    this.categoriaService.salvarCategoria(this.categoriaAtual).subscribe({
      next: () => {
        this.interacaoService.sucesso('Categoria salva com sucesso.');
        this.carregarCategorias(); 
        this.categoriaAtual = { id: 0, nome: '' }; 
      },
      error: () => this.interacaoService.erro('Erro ao salvar categoria.'),
    });
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaAtual = { ...categoria };
  }

  excluirCategoria(id: number | undefined): void {
    if (id === undefined) return;
    
    const categoria = this.listaCategorias.find(c => c.id === id);
    if (!categoria || !this.interacaoService.confirmarExclusao(categoria.nome)) return;

    this.categoriaService.excluirCategoria(id).subscribe({
      next: () => {
        this.interacaoService.sucesso('Categoria excluída com sucesso.');
        this.carregarCategorias();
        if (this.categoriaAtual.id === id) {
          this.categoriaAtual = { id: 0, nome: '' };
        }
      },
      error: () => this.interacaoService.erro('Erro ao excluir categoria.'),
    });
  }
}