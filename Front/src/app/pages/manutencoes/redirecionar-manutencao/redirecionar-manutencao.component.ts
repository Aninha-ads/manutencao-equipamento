import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Funcionario {
  id: number;
  nome: string;
  email: string;
}

@Component({
  selector: 'app-redirecionar-manutencao',
  imports: [FormsModule, RouterLink],
  templateUrl: './redirecionar-manutencao.component.html',
  styleUrl: './redirecionar-manutencao.component.css',
})
export class RedirecionarManutencaoComponent {
  private readonly chaveFuncionarios = 'funcionarios';

  private funcionariosPadrao: Funcionario[] = [
    {
      id: 1,
      nome: 'Maria Souza',
      email: 'maria.teste@empresa.com'
    },
    {
      id: 2,
      nome: 'Mario Oliveira',
      email: 'mario.teste@empresa.com'
    },
    {
      id: 3,
      nome: 'Pedro Silva',
      email: 'pedro.teste@empresa.com'
    }
  ];

  funcionarios: Funcionario[] = this.carregarFuncionarios();
  funcionarioAtual: Funcionario = this.funcionarios[0];
  funcionariosDisponiveis: Funcionario[] = this.funcionarios.filter(
    funcionario => funcionario.id !== this.funcionarioAtual.id
  );
  funcionarioDestinoId = '';

  private carregarFuncionarios(): Funcionario[] {
    const funcionariosSalvos = localStorage.getItem(this.chaveFuncionarios);

    if (funcionariosSalvos) {
      return JSON.parse(funcionariosSalvos) as Funcionario[];
    }

    localStorage.setItem(this.chaveFuncionarios, JSON.stringify(this.funcionariosPadrao));
    return this.funcionariosPadrao;
  }
}