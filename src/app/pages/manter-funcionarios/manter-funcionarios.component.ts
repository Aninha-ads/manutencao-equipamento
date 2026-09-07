import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
interface Funcionario {
  id: number;
  email: string;
  nome: string;
  nascimento: string;
}
//catando componente
@Component({
  selector: 'app-manter-funcionarios',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './manter-funcionarios.component.html',
  styleUrl: './manter-funcionarios.component.css'
})
//nn sei fazer todo esse semi-back direito
export class ManterFuncionariosComponent {
  // funcionário atualmente logado
  funcionarioLogadoId = 1;
  // controle do formulário
  modoEdicao = false;
  funcionarioEditandoId: number | null = null;
  // dados do formulário
  email = '';
  nome = '';
  nascimento = '';
  senha = '';

  // dados fictícios para o protótipo
  funcionarios: Funcionario[] = [
    {
      id: 1,
      email: 'maria@empresa.com',
      nome: 'Maria',
      nascimento: '1990-05-15'
    },
    {
      id: 2,
      email: 'mario@empresa.com',
      nome: 'Mário',
      nascimento: '1988-10-20'
    }
  ];

  //adiciona um novo funcionário.
  adicionarFuncionario(): void {
    if (!this.email || !this.nome || !this.nascimento || !this.senha) {
      alert('Preencha todos os campos.');
      return;}

    const emailExiste = this.funcionarios.some(
      funcionario => funcionario.email === this.email);

    if (emailExiste) {
      alert('Este e-mail já está cadastrado.');
      return;}

    const novoFuncionario: Funcionario = {
      id: this.proximoId(),
      email: this.email,
      nome: this.nome,
      nascimento: this.nascimento};

    this.funcionarios.push(novoFuncionario);
    alert('Funcionário cadastrado com sucesso!');
    this.limparFormulario();
  }
  // prepara um funcionário para edição.
 editarFuncionario(funcionario: Funcionario): void {
    this.modoEdicao = true;
    this.funcionarioEditandoId = funcionario.id;
    this.email = funcionario.email;
    this.nome = funcionario.nome;
    this.nascimento = funcionario.nascimento;
    // Por segurança, a senha não é preenchida
    this.senha = '';
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  //atualiza um funcionário existente.
     atualizarFuncionario(): void {

    if (this.funcionarioEditandoId === null) {
      return;}
    if (!this.email || !this.nome || !this.nascimento) {
      alert('Preencha os campos obrigatórios.');
      return;}

    const funcionario = this.funcionarios.find(
      f => f.id === this.funcionarioEditandoId);

    if (!funcionario) {
      return;}

    funcionario.email = this.email;
    funcionario.nome = this.nome;
    funcionario.nascimento = this.nascimento;
    alert('Funcionário atualizado com sucesso!');
    this.limparFormulario();}

  //remove um funcionário
  removerFuncionario(funcionario: Funcionario): void {

    // regra do RF018:
    // funcionário não pode remover a si mesmo (nn pode se demitir o cara kkkkkkk)
    if (funcionario.id === this.funcionarioLogadoId) {
      alert('Você não pode remover seu próprio usuário.');
      return;
    }

    // regra do RF018 também:
    // se existir apenas um funcionário, não pode remover (fecha esse quiosque)
    if (this.funcionarios.length === 1) {
      alert('O sistema precisa possuir pelo menos um funcionário.');
      return;
    }
    const confirmar = confirm(
      `Deseja realmente remover o funcionário ${funcionario.nome}?`
    );
    if (!confirmar) {
      return;
    }
    this.funcionarios = this.funcionarios.filter(
      f => f.id !== funcionario.id
    );
    alert('Funcionário removido com sucesso!');
  }

  //se a pessoa cancelar a edição, limpa o formulário (um extra, função seguinte)
  cancelarEdicao(): void {
    this.limparFormulario();}
  
  limparFormulario(): void {
    this.email = '';
    this.nome = '';
    this.nascimento = '';
    this.senha = '';
    this.modoEdicao = false;
    this.funcionarioEditandoId = null;
  }

  //gera o próximo id, sla gente, complicado essa parte
  private proximoId(): number {
    if (this.funcionarios.length === 0) {
      return 1;
    }
    return Math.max(
      ...this.funcionarios.map(f => f.id)
    ) + 1;
  }
}