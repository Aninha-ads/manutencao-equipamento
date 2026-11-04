package app.controllers;

import app.services.SolicitacaoService;
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

    @PatchMapping("/{id}/pagar")
    public ResponseEntity<Object> registrarPagamento(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.registrarPagamento(id));
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<Object> finalizarSolicitacao(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.finalizarSolicitacao(id));
    }
}