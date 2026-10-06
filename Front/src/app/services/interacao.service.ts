import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InteracaoService {
  sucesso(mensagem: string): void {
    window.alert(`Sucesso: ${mensagem}`);
  }

  erro(mensagem: string): void {
    window.alert(`Erro: ${mensagem}`);
  }

  confirmarExclusao(item: string): boolean {
    return window.confirm(`Você tem certeza que deseja excluir o registro "${item}"?`);
  }

  confirmarAcao(pergunta: string): boolean {
    return window.confirm(pergunta);
  }
}