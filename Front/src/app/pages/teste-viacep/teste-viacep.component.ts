import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

import { ViaCepService } from '../../core/services/via-cep.service';
import { Endereco } from '../../core/models/cliente.model';

@Component({
  selector: 'app-teste-viacep',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './teste-viacep.component.html',
  styleUrl: './teste-viacep.component.css'
})
export class TesteViacepComponent {
  cep = '';
  endereco: Endereco | null = null;
  carregando = false;
  erro = '';

  private viaCep = inject(ViaCepService);

  buscar(): void {
    this.erro = '';
    this.endereco = null;

    const cepLimpo = this.cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      this.erro = 'Digite um CEP com 8 dígitos.';
      return;
    }

    this.carregando = true;

    this.viaCep.buscarPorCep(cepLimpo).subscribe({
      next: (endereco) => {
        this.carregando = false;
        if (!endereco) {
          this.erro = 'CEP não encontrado.';
          return;
        }
        this.endereco = endereco;
      },
      error: () => {
        this.carregando = false;
        this.erro = 'Erro ao consultar o ViaCEP. Tente novamente.';
      }
    });
  }

  limpar(): void {
    this.cep = '';
    this.endereco = null;
    this.erro = '';
  }
}