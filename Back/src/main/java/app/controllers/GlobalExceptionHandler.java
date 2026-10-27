package app.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, Object> erroPadrao = new HashMap<>();
        erroPadrao.put("timestamp", LocalDateTime.now());
        erroPadrao.put("status", HttpStatus.BAD_REQUEST.value());
        erroPadrao.put("erro", "Dados Inválidos");
        erroPadrao.put("mensagem", ex.getMessage());
        
        return new ResponseEntity<>(erroPadrao, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> erroPadrao = new HashMap<>();
        erroPadrao.put("timestamp", LocalDateTime.now());
        // Usamos FORBIDDEN (403) ou CONFLICT (409) para regras de negócio bloqueadas
        erroPadrao.put("status", HttpStatus.FORBIDDEN.value()); 
        erroPadrao.put("erro", "Ação Não Permitida");
        erroPadrao.put("mensagem", ex.getMessage());
        
        return new ResponseEntity<>(erroPadrao, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericoException(Exception ex) {
        Map<String, Object> erroPadrao = new HashMap<>();
        erroPadrao.put("timestamp", LocalDateTime.now());
        erroPadrao.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        erroPadrao.put("erro", "Erro Interno do Servidor");
        erroPadrao.put("mensagem", "Ocorreu um erro inesperado no sistema. Tente novamente mais tarde.");
        
        return new ResponseEntity<>(erroPadrao, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}