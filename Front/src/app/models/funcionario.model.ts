export interface Funcionario {
    id?: number;
    email: string;
    nome: string;
    dataNascimento: string;
    senha?: string;
    ativo: boolean;
}
