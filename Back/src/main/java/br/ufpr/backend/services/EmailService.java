package br.ufpr.backend.services;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final Optional<JavaMailSender> mailSender;

    @Value("${spring.mail.username:nao-responda@manutencao.ufpr.br}")
    private String remetente;

    public EmailService(Optional<JavaMailSender> mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarSenhaAutocadastro(String nome, String emailDestino, String senhaQuatroDigitos) {
        if (mailSender.isEmpty()) {
            log.error("JavaMailSender não configurado para o autocadastro.");
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "O envio da senha por e-mail está indisponível.");
        }

        try {
            SimpleMailMessage mensagem = new SimpleMailMessage();
            mensagem.setFrom(remetente);
            mensagem.setTo(emailDestino);
            mensagem.setSubject("Bem-vindo ao Sistema de Manutenção de Equipamentos - Sua Senha de Acesso");
            mensagem.setText(String.format(
                    "Olá, %s!\n\n"
                    + "Seu autocadastro foi realizado com sucesso.\n"
                    + "Para acessar o sistema, utilize seu e-mail (%s) e a senha de 4 números abaixo:\n\n"
                    + "Senha: %s\n\n"
                    + "Atenciosamente,\nEquipe de Manutenção de Equipamentos",
                    nome, emailDestino, senhaQuatroDigitos));

            mailSender.get().send(mensagem);
            log.info("E-mail enviado via SMTP com sucesso para {}", emailDestino);
        } catch (MailException e) {
            log.error("Falha no envio da senha de autocadastro via SMTP.", e);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Não foi possível enviar a senha por e-mail.", e);
        }
    }
}
