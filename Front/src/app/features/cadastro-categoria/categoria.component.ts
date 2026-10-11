import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { InteracaoService } from '../../services/interacao.service';
//categoria para formulário reativo
//ainda precisa integrar com o back
@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
})
export class CategoriaComponent implements OnInit {
  categoriaForm: FormGroup;
  listaCategorias: Categoria[] = [];
  categoriaEditandoId: number = 0;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private interacaoService: InteracaoService
  ) {
    this.categoriaForm = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          this.validarEspacos
        ]
      ]
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  // Bloqueia nomes vazios ou com espaços no início/fim.
  private validarEspacos(
    control: AbstractControl
  ): ValidationErrors | null {
    const nome = String(control.value ?? '');

    if (nome.length === 0) {
      return null; // Validators.required trata o campo vazio.
    }
    if (nome !== nome.trim()) {
      return { espacosExternos: true };
    }
    if (nome.trim().length === 0) {
      return { apenasEspacos: true };
    }
    return null;
  }

  get nome() {
    return this.categoriaForm.get('nome')!;
//lembrete : CONFIGURAR DATABASE para conseguir listar categorias
  }
  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (dados) => {
        this.listaCategorias = dados;
      },
      error: () => {
        this.interacaoService.erro('Erro ao carregar categorias.');
      }
    });
  }

  salvarCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }
    const nome = String(this.nome.value).trim();
    const categoria: Categoria = {
      id: this.categoriaEditandoId,
      nome: nome
    };
    this.categoriaService.salvarCategoria(categoria).subscribe({
      next: () => {
        this.interacaoService.sucesso('Categoria salva com sucesso.');
        this.carregarCategorias();
        this.limparFormulario();
      },
      error: () => {
        this.interacaoService.erro(
          'Erro ao salvar categoria. Verifique se já existe uma categoria com esse nome.'
        );
      }
    });
  }
//selecionar uma categoria para editar
  editarCategoria(categoria: Categoria): void {
    this.categoriaEditandoId = categoria.id ?? 0;

    this.categoriaForm.patchValue({
      nome: categoria.nome
    });

    this.categoriaForm.markAsPristine();
    this.categoriaForm.markAsUntouched();
  }
  //ou aqui para excluir
  excluirCategoria(id: number | undefined): void {
    if (id === undefined) {
      return;
    }
    const categoria = this.listaCategorias.find(c => c.id === id);
    if (
      !categoria ||
      !this.interacaoService.confirmarExclusao(categoria.nome)
    ) {
      return;
    }
    this.categoriaService.excluirCategoria(id).subscribe({
      next: () => {
        this.interacaoService.sucesso('Categoria excluída com sucesso.');
        this.carregarCategorias();

        if (this.categoriaEditandoId === id) {
          this.limparFormulario();
        }
      },
      error: () => {
        this.interacaoService.erro('Erro ao excluir categoria.');
      }
    });
  }
//função para limpar o form que é usada acima
  limparFormulario(): void {
    this.categoriaEditandoId = 0;
    this.categoriaForm.reset({ nome: '' });
  }
}