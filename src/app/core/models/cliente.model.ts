export interface Endereco {
  cep: string;
  logradouro: string;     
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Cliente {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: Endereco; // Objeto endereco
}