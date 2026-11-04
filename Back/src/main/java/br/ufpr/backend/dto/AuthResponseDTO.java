package br.ufpr.backend.dto;

import java.time.Instant;

public record AuthResponseDTO(
        Integer id,
        String nome,
        String email,
        String perfil,
        String token,
        Instant expiresAt) {}
