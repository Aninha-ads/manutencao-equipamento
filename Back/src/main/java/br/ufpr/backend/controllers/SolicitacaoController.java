package br.ufpr.backend.controllers;

import br.ufpr.backend.services.DadosService;
import br.ufpr.backend.security.ApiAuthenticationFilter;
import br.ufpr.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
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
    public List<DadosService.Solicitacao> listar(
            @RequestAttribute(ApiAuthenticationFilter.USER_ATTRIBUTE) AuthenticatedUser user) {
        return dados.solicitacoes(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Integer> abrir(
            @Valid @RequestBody DadosService.Abertura abertura,
            @RequestAttribute(ApiAuthenticationFilter.USER_ATTRIBUTE) AuthenticatedUser user) {
        return Map.of("id", dados.abrir(abertura, user));
    }

    @PatchMapping("/{id}/estado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void estado(
            @PathVariable int id,
            @RequestBody DadosService.MudancaEstado mudanca,
            @RequestAttribute(ApiAuthenticationFilter.USER_ATTRIBUTE) AuthenticatedUser user) {
        dados.mudarEstado(id, mudanca, user);
    }
}
