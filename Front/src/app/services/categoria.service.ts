import { inject, Injectable } from '@angular/core';
import { defer, of } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { DadosService } from '../core/services/dados.service';
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private dados = inject(DadosService);
  listarCategorias() { return defer(() => of(this.dados.listarCategorias())); }
  salvarCategoria(categoria: Categoria) { return defer(() => this.dados.salvarCategoria(categoria)); }
  excluirCategoria(id: number) { return defer(() => this.dados.excluirCategoria(id)); }
}
