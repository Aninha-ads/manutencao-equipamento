package br.ufpr.backend.controllers;

import br.ufpr.backend.services.DadosService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "http://localhost:4200")
public class SolicitacaoController {
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
    }
}
