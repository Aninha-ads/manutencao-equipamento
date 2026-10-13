package app.controllers;

import app.models.Solicitacao;
import app.services.SolicitacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "*")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    public ResponseEntity<Object> criarEndpointAbertura(@RequestBody Solicitacao solicitacao) {
        try {
         
            Solicitacao solicitacaoCriada = solicitacaoService.abrirSolicitacao(solicitacao);
            
            
            return ResponseEntity.status(HttpStatus.CREATED).body(solicitacaoCriada);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erro interno ao tentar abrir a solicitação de manutenção.");
        }
    }
    @GetMapping
    public ResponseEntity<List<Solicitacao>> listarSolicitacoes(@RequestParam(required = false) Long clienteId) {
        List<Solicitacao> lista = solicitacaoService.listarSolicitacoes(clienteId);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/periodo")
    public ResponseEntity<Object> buscarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        try {
            List<Solicitacao> lista = solicitacaoService.buscarPorPeriodo(inicio, fim);
            return ResponseEntity.ok(lista);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erro ao processar a busca por período.");
        }
    }
}