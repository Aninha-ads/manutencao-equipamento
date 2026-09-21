import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Endereco } from '../models/cliente.model';
import { environment } from '../../../environments/environment';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ViaCepService {
  private http = inject(HttpClient);

  buscarPorCep(cep: string): Observable<Endereco | null> {
    const limpo = cep.replace(/\D/g, '');

    return this.http
      .get<ViaCepResponse>(`https://viacep.com.br/ws/${limpo}/json/`)
      .pipe(
        map((resposta) => {
          if (resposta.erro) return null;

          const endereco: Endereco = {
            cep: resposta.cep,
            logradouro: resposta.logradouro,
            bairro: resposta.bairro,
            cidade: resposta.localidade,
            estado: resposta.uf,
            numero: '',
            complemento: ''
          };
          return endereco;
        })
      );
  }
}