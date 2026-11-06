package app.controllers;

import app.models.Solicitacao;
import app.services.SolicitacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "*")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PatchMapping("/{id}/pagar")
    public ResponseEntity<Solicitacao> registrarPagamento(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.registrarPagamento(id));
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<Solicitacao> finalizarSolicitacao(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.finalizarSolicitacao(id));
    }
}
