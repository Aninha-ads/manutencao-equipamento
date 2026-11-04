package br.ufpr.backend.controllers;

import br.ufpr.backend.services.DadosService;
import br.ufpr.backend.services.CategoriaService;
import br.ufpr.backend.services.AuthService;
import br.ufpr.backend.dto.AuthResponseDTO;
import br.ufpr.backend.dto.ClienteCadastroDTO;
import br.ufpr.backend.dto.FuncionarioCadastroDTO;
import br.ufpr.backend.dto.FuncionarioEdicaoDTO;
import br.ufpr.backend.security.ApiAuthenticationFilter;
import br.ufpr.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class DadosController {
    private final DadosService dados;
    private final CategoriaService categorias;
    private final AuthService auth;
    public DadosController(DadosService dados, CategoriaService categorias, AuthService auth) {
        this.dados = dados;
        this.categorias = categorias;
        this.auth = auth;
    }
    @GetMapping("/dados")
    public Map<String, Object> carregar(
            @RequestAttribute(ApiAuthenticationFilter.USER_ATTRIBUTE) AuthenticatedUser user) {
        boolean funcionario = AuthenticatedUser.FUNCIONARIO.equals(user.perfil());
        return Map.of("clientes", funcionario ? dados.clientes() : dados.clientes(user.id()),
            "funcionarios", funcionario ? dados.funcionarios() : List.of(),
            "categorias", categorias.listarAtivas(), "solicitacoes", dados.solicitacoes(user));
    }
    @GetMapping("/clientes") public List<DadosService.Cliente> clientes() { return dados.clientes(); }
    @PostMapping("/clientes") @ResponseStatus(HttpStatus.CREATED)
    public AuthResponseDTO criarCliente(@Valid @RequestBody ClienteCadastroDTO c) {
        return auth.cadastrarCliente(c);
    }
    @PutMapping("/clientes/{id}")
    public DadosService.Cliente alterarCliente(@PathVariable int id, @RequestBody DadosService.Cliente c) { return dados.salvarCliente(id, c); }
    @GetMapping("/funcionarios") public List<DadosService.Funcionario> funcionarios() { return dados.funcionarios(); }
    @PostMapping("/funcionarios") @ResponseStatus(HttpStatus.CREATED)
    public DadosService.Funcionario criarFuncionario(@Valid @RequestBody FuncionarioCadastroDTO f) {
        return dados.salvarFuncionario(null,
            new DadosService.Funcionario(null, f.nome(), f.email(), f.nascimento().toString()), f.senha());
    }
    @PutMapping("/funcionarios/{id}")
    public DadosService.Funcionario alterarFuncionario(@PathVariable int id, @Valid @RequestBody FuncionarioEdicaoDTO f) {
        return dados.salvarFuncionario(id,
            new DadosService.Funcionario(id, f.nome(), f.email(), f.nascimento().toString()), f.senha());
    }
    @DeleteMapping("/funcionarios/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerFuncionario(
            @PathVariable int id,
            @RequestAttribute(ApiAuthenticationFilter.USER_ATTRIBUTE) AuthenticatedUser user) {
        if (user.id().equals(id)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.CONFLICT, "Você não pode desativar a própria conta.");
        }
        dados.removerFuncionario(id);
    }
    @ExceptionHandler(DataIntegrityViolationException.class) @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> conflito() { return Map.of("message", "Dados duplicados ou referência inválida"); }
}
