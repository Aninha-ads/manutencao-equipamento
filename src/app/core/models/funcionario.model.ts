  export class Funcionario {
    constructor(
      public id: number = 0,
      public nome: string = "",
      public email: string = "",
      public dataNascimento: string = "",
      public ativo: boolean = true,
      public login: string = "",
      public senha: string = "",   // armazena "saltHex:hashHex", nao a senha pura
      public perfil: string = ""   // FUNC | GERENTE | ADMIN
    ) {}
  }