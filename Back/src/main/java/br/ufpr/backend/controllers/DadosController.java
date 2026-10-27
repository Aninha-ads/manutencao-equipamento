package br.ufpr.backend.controllers;

import br.ufpr.backend.services.DadosService;
import br.ufpr.backend.services.CategoriaService;
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
    public DadosController(DadosService dados, CategoriaService categorias) { this.dados = dados; this.categorias = categorias; }
    @GetMapping("/dados")
    public Map<String, Object> carregar() {
        return Map.of("clientes", dados.clientes(), "funcionarios", dados.funcionarios(),
            "categorias", categorias.listarAtivas(), "solicitacoes", dados.solicitacoes());
    }
    @GetMapping("/clientes") public List<DadosService.Cliente> clientes() { return dados.clientes(); }
    @PostMapping("/clientes") @ResponseStatus(HttpStatus.CREATED)
    public DadosService.Cliente criarCliente(@RequestBody DadosService.Cliente c) { return dados.salvarCliente(null, c); }
    @PutMapping("/clientes/{id}")
    public DadosService.Cliente alterarCliente(@PathVariable int id, @RequestBody DadosService.Cliente c) { return dados.salvarCliente(id, c); }
    @GetMapping("/funcionarios") public List<DadosService.Funcionario> funcionarios() { return dados.funcionarios(); }
    @PostMapping("/funcionarios") @ResponseStatus(HttpStatus.CREATED)
    public DadosService.Funcionario criarFuncionario(@RequestBody DadosService.Funcionario f) { return dados.salvarFuncionario(null, f); }
    @PutMapping("/funcionarios/{id}")
    public DadosService.Funcionario alterarFuncionario(@PathVariable int id, @RequestBody DadosService.Funcionario f) { return dados.salvarFuncionario(id, f); }
    @DeleteMapping("/funcionarios/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerFuncionario(@PathVariable int id) { dados.removerFuncionario(id); }
    @ExceptionHandler(DataIntegrityViolationException.class) @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> conflito() { return Map.of("message", "Dados duplicados ou referência inválida"); }
}
