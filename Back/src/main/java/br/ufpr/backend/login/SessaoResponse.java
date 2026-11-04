package br.ufpr.backend.login;

/** Dados devolvidos ao front após um login válido. Nunca inclui hash ou salt. */
public record SessaoResponse(Integer id, String nome, String email, PerfilUsuario perfil) {
}
