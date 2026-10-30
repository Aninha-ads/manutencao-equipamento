package br.ufpr.backend.security;

public record AuthenticatedUser(Integer id, String nome, String email, String perfil) {
    public static final String CLIENTE = "CLIENTE";
    public static final String FUNCIONARIO = "FUNCIONARIO";
}
