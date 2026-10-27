
package app.controllers;

import br.ufpr.backend.models.Categoria;
import br.ufpr.backend.repositories.CategoriaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "http://localhost:4200")
public class ApiCategoriaController {

    private final CategoriaRepository repository;

    public ApiCategoriaController(CategoriaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Categoria> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Categoria cadastrar(@RequestBody Categoria categoria) {
        categoria.setId(null);
        return repository.save(categoria);
    }

    @PutMapping("/{id}")
    public Categoria atualizar(
            @PathVariable Integer id,
            @RequestBody Categoria categoria) {

        Categoria existente = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Categoria não encontrada"));

        existente.setNome(categoria.getNome());

        if (categoria.getAtivo() != null) {
            existente.setAtivo(categoria.getAtivo());
        }

        return repository.save(existente);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
