package br.ufpr.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClienteCadastroDTO(
        @NotBlank @Size(max = 150) String nome,
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(min = 6, max = 100) String senha,
        @NotBlank @Size(min = 11, max = 11) String cpf,
        @NotBlank @Size(min = 11, max = 11) String telefone,
        @NotBlank @Size(min = 8, max = 8) String cep,
        @NotBlank @Size(max = 200) String logradouro,
        @NotBlank @Size(max = 20) String numero,
        @Size(max = 150) String complemento,
        @NotBlank @Size(max = 100) String bairro,
        @NotBlank @Size(max = 100) String cidade,
        @NotBlank @Size(min = 2, max = 2) String uf) {}
