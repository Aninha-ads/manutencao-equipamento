package br.ufpr.backend.controllers;

<<<<<<< HEAD
import br.ufpr.backend.models.Solicitacao;
import br.ufpr.backend.services.SolicitacaoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
=======
import br.ufpr.backend.services.DadosService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
>>>>>>> 4d8446e8732d3cd0af841b5852c66c96e7193a78

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "http://localhost:4200")
public class SolicitacaoController {
<<<<<<< HEAD

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
=======
    private final DadosService dados;
    public SolicitacaoController(DadosService dados) { this.dados = dados; }
    @GetMapping
    public List<DadosService.Solicitacao> listar() { return dados.solicitacoes(); }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Integer> abrir(@RequestBody DadosService.Abertura abertura) {
        return Map.of("id", dados.abrir(abertura));
    }
    public record Mudanca(String estado, Integer autorId) {}
    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void estado(@PathVariable int id, @RequestBody Mudanca mudanca) {
        dados.mudarEstado(id, mudanca.estado(), mudanca.autorId());
>>>>>>> 4d8446e8732d3cd0af841b5852c66c96e7193a78
    }
}
