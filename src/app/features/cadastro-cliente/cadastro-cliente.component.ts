import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  imports: [FormsModule],
  templateUrl: './cadastro-cliente.component.html',
  styleUrl: './cadastro-cliente.component.css',
})
export class CadastroClienteComponent {
  private http = inject(HttpClient);

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
          this.cliente.uf = dados.uf;
        } else {
          alert('CEP não encontrado');
        }
      });
    }
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
  }
}