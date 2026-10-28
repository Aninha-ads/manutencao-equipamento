package br.ufpr.backend.services;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.stereotype.Service;

@Service
public class HashService {

    public String gerarSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    public String gerarHash(String senha, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(Base64.getDecoder().decode(salt));
            byte[] hash = md.digest(senha.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar a encriptação", e);
        }
    }

    public boolean validarSenha(String senhaFornecida, String saltArmazenado, String hashArmazenado) {
        String hashCalculado = gerarHash(senhaFornecida, saltArmazenado);
        return hashCalculado.equals(hashArmazenado);
    }
}