package br.ufpr.backend.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public record FuncionarioEdicaoDTO(
        @NotBlank @Size(max = 150) String nome,
        @NotBlank @Email @Size(max = 254) String email,
        @Size(min = 6, max = 100) String senha,
        @NotNull @Past LocalDate nascimento) {}
