import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';

export interface ClienteRegistro {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

@Component({
  selector: 'app-cadastro-cliente',
  imports: [FormsModule, NgxMaskDirective],
  templateUrl: './cadastro-cliente.component.html',
  styleUrl: './cadastro-cliente.component.css',
})
export class CadastroClienteComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  cliente: ClienteRegistro = {
    nome: '', email: '', cpf: '', telefone: '',
    cep: '', logradouro: '', numero: '',
    complemento: '', bairro: '', cidade: '', uf: ''
  };

  buscarCep() {
    const cepLimpo = this.cliente.cep.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe((dados: any) => {
        if (!dados.erro) {
          this.cliente.logradouro = dados.logradouro;
          this.cliente.bairro = dados.bairro;
          this.cliente.cidade = dados.localidade;
          this.atualizarUf(dados.uf);
        } else {
          alert('CEP não encontrado');
        }
      });
    }
  }

  atualizarUf(valor: string): void {
    this.cliente.uf = valor
      .replace(/[^a-zA-Z]/g, '')
      .slice(0, 2)
      .toUpperCase();
  }

  gerarSenhaAleatoria(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  onSubmit() {
    const senhaGerada = this.gerarSenhaAleatoria();
    
    const payloadParaSalvar = {
      ...this.cliente,
      senha: senhaGerada
    };

    console.log(payloadParaSalvar);
    alert('Sucesso no cadastro.');
    this.router.navigate(['/painel-cliente']);
  }
}