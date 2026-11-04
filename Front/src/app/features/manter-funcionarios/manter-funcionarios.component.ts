import { DadosService } from '../../core/services/dados.service';
import { AuthService } from '../../core/services/auth.service';
import { FuncionarioTela as Funcionario } from '../../core/models/dados-tela.model';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
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
  private dados = inject(DadosService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  // funcionário atualmente logado
  funcionarioLogadoId = this.auth.id ?? 0;
  // controle do formulário
  modoEdicao = false;
  funcionarioEditandoId: number | null = null;
  // dados do formulário
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    nome: ['', Validators.required],
    nascimento: ['', Validators.required],
    senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
  });

  // Funcionários carregados das tabelas funcionario e usuario.
  funcionarios = this.dados.listarFuncionarios();

  // Valida os dados e adiciona um novo funcionário à lista.
  async adicionarFuncionario(): Promise<void> {
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
      id: 0,
      email,
      nome,
      nascimento: this.form.value.nascimento
    };

    if (!await this.persistir(() => this.dados.salvarFuncionario(
      novoFuncionario, true, this.form.controls['senha'].value
    ))) return;
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
  async atualizarFuncionario(): Promise<void> {
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

    if (!await this.persistir(() => this.dados.salvarFuncionario(
      { ...funcionario, email, nome, nascimento: this.form.value.nascimento },
      false,
      this.form.controls['senha'].value
    ))) return;
    alert('Funcionário atualizado com sucesso!');
    this.limparFormulario();
  }

  // Remove um funcionário somente depois de validar as regras de segurança.
  async removerFuncionario(funcionario: Funcionario): Promise<void> {

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
    if (!await this.persistir(() => this.dados.removerFuncionario(funcionario.id))) return;
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

  private async persistir(acao: () => Promise<unknown>): Promise<boolean> {
    try {
      await acao();
      this.funcionarios = this.dados.listarFuncionarios();
      return true;
    } catch {
      alert('Não foi possível salvar a alteração no banco. Verifique os dados e tente novamente.');
      return false;
    }
  }
}
