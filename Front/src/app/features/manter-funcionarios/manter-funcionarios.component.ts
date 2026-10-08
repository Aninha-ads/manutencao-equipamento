import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
interface Funcionario {
  id: number;
  email: string;
  nome: string;
  nascimento: string;
}
//componente seletor, importações etc.
@Component({
  selector: 'app-manter-funcionarios',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './manter-funcionarios.component.html',
  styleUrl: './manter-funcionarios.component.css'
})
//nn sei fazer todo esse semi-back direito
export class ManterFuncionariosComponent {
  private readonly chaveFuncionarios = 'funcionarios';
  private fb = inject(FormBuilder);

  // funcionário atualmente logado
  funcionarioLogadoId = 1;
  // controle do formulário
  modoEdicao = false;
  funcionarioEditandoId: number | null = null;
  // dados do formulário
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    nome: ['', Validators.required],
    nascimento: ['', Validators.required],
    senha: ['', Validators.required], // obrigatória só no cadastro; ajustada em alternarModoEdicao()
  });

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

  constructor() {
    const funcionariosSalvos = localStorage.getItem(this.chaveFuncionarios);

    if (funcionariosSalvos) {
      this.funcionarios = JSON.parse(funcionariosSalvos) as Funcionario[];
    } else {
      this.salvarFuncionarios();
    }
  }

  // Valida os dados e adiciona um novo funcionário à lista.
  adicionarFuncionario(): void {
    // Remove espaços extras e padroniza o e-mail para evitar duplicidades.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = (this.form.value.email as string).trim().toLowerCase();
    const nome = (this.form.value.nome as string).trim();

    // Compara os e-mails sem diferenciar letras maiúsculas e minúsculas.
    const emailExiste = this.funcionarios.some(
      funcionario => funcionario.email.toLowerCase() === email);

    if (emailExiste) {
      alert('Este e-mail já está cadastrado.');
      return;
    }

    const novoFuncionario: Funcionario = {
      id: this.proximoId(),
      email,
      nome,
      nascimento: this.form.value.nascimento
    };

    this.funcionarios.push(novoFuncionario);
    this.salvarFuncionarios();
    alert('Funcionário cadastrado com sucesso!');
    this.limparFormulario();
  }
  // Carrega os dados do funcionário selecionado no formulário de edição.
  editarFuncionario(funcionario: Funcionario): void {
    this.modoEdicao = true;
    this.funcionarioEditandoId = funcionario.id;
    this.form.patchValue({
      email: funcionario.email,
      nome: funcionario.nome,
      nascimento: funcionario.nascimento,
      senha: '' // a senha existente não é exibida, por segurança
    });
    this.atualizarValidadorSenha();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Valida e atualiza os dados do funcionário selecionado.
  atualizarFuncionario(): void {
    if (this.funcionarioEditandoId === null) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = (this.form.value.email as string).trim().toLowerCase();
    const nome = (this.form.value.nome as string).trim();

    // Ignora o próprio registro, mas bloqueia e-mail usado por outro funcionário.
    const emailExiste = this.funcionarios.some(
      funcionario => funcionario.id !== this.funcionarioEditandoId
        && funcionario.email.toLowerCase() === email
    );

    if (emailExiste) {
      alert('Este e-mail já está cadastrado para outro funcionário.');
      return;
    }

    // Garante que o funcionário ainda existe antes de alterar seus dados.
    const funcionario = this.funcionarios.find(f => f.id === this.funcionarioEditandoId);
    if (!funcionario) {
      return;
    }

    funcionario.email = email;
    funcionario.nome = nome;
    funcionario.nascimento = this.form.value.nascimento;

    this.salvarFuncionarios();
    alert('Funcionário atualizado com sucesso!');
    this.limparFormulario();
  }

  // Remove um funcionário somente depois de validar as regras de segurança.
  removerFuncionario(funcionario: Funcionario): void {

    // RF018: impede que o funcionário logado remova o próprio usuário.
    if (funcionario.id === this.funcionarioLogadoId) {
      alert('Você não pode remover seu próprio usuário.');
      return;
    }

    // RF018: mantém pelo menos um funcionário cadastrado no sistema.
    if (this.funcionarios.length <= 1) {
      alert('O sistema precisa possuir pelo menos um funcionário.');
      return;
    }
    // Solicita confirmação antes de excluir permanentemente o registro.
    const confirmar = confirm(
      `Deseja realmente remover o funcionário ${funcionario.nome}?`
    );
    if (!confirmar) {
      return;
    }
    // Remove somente o funcionário escolhido, preservando os demais registros.
    this.funcionarios = this.funcionarios.filter(f => f.id !== funcionario.id);
    this.salvarFuncionarios();
    alert('Funcionário removido com sucesso!');
  }

  // Cancela a edição e retorna o formulário ao modo de cadastro.
  cancelarEdicao(): void {
    this.limparFormulario();
  }

  // Limpa os dados e reinicia o estado do formulário.
  limparFormulario(): void {
    this.form.reset({ email: '', nome: '', nascimento: '', senha: '' });
    this.modoEdicao = false;
    this.funcionarioEditandoId = null;
    this.atualizarValidadorSenha();
  }

  // Alterna a obrigatoriedade da senha: obrigatória no cadastro, opcional na edição.
  private atualizarValidadorSenha(): void {
    const senhaControl = this.form.get('senha');

    if (this.modoEdicao) {
      senhaControl?.clearValidators();
    } else {
      senhaControl?.setValidators(Validators.required);
    }

    senhaControl?.updateValueAndValidity();
  }

  // Calcula um identificador maior que todos os registros existentes.
  private proximoId(): number {
    if (this.funcionarios.length === 0) {
      return 1;
    }
    return Math.max(...this.funcionarios.map(f => f.id)) + 1;
  }

  private salvarFuncionarios(): void {
    localStorage.setItem(this.chaveFuncionarios, JSON.stringify(this.funcionarios));
  }
}