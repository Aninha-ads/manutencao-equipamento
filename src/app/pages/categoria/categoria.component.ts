import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categoria',
  imports: [FormsModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
})
  //estou colocando esses métodos pois o html fazia referência a eles.
export class CategoriaComponent {
  categoriaAtual = {
    id: 0,
    nome: ''
  };
  //aaaaaaatualizacao das branchs
  listaCategorias: any[] = [];
  salvarCategoria() {
    if(this.categoriaAtual.nome.trim() === '') {
      return;
    }
    if (this.categoriaAtual.id === 0) {
    //cadastrar nova categoria
    const novoID = this.listaCategorias.length + 1;
    this.listaCategorias.push({
      id: novoID,
      nome: this.categoriaAtual.nome
    });
    } else {
    //atualizar categoria existente
    const categoria = this.listaCategorias.find(
      c => c.id === this.categoriaAtual.id
    );
    if(categoria) {
      categoria.nome = this.categoriaAtual.nome;
    }
    }
    //limpa o formulario
    this.categoriaAtual = {
      id: 0,
      nome: ''
    };
  }
  editarCategoria(categoria: any) {
    this.categoriaAtual = {
      id: categoria.id,
      nome: categoria.nome
    };
  }
  excluirCategoria(id: number) {
    this.listaCategorias = this.listaCategorias.filter(
      categoria => categoria.id !== id
    );
  }
}
