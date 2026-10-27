package br.ufpr.backend.controllers;

import br.ufpr.backend.models.Solicitacao;
import br.ufpr.backend.services.SolicitacaoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "http://localhost:4200")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Solicitacao abrir(@RequestBody Solicitacao solicitacao) {
        try {
            return solicitacaoService.abrirSolicitacao(solicitacao);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
    }

    @GetMapping
    public List<Solicitacao> listar(
            @RequestParam(required = false) Integer clienteId) {
        return solicitacaoService.listarSolicitacoes(clienteId);
    }

    @GetMapping("/periodo")
    public List<Solicitacao> buscarPorPeriodo(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime inicio,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fim) {
        try {
            return solicitacaoService.buscarPorPeriodo(inicio, fim);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
    }
}
