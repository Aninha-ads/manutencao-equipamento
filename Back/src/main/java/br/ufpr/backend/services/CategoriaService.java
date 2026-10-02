package br.ufpr.backend.services;

import br.ufpr.backend.models.Categoria;
import br.ufpr.backend.repositories.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;

    public List<Categoria> listarAtivas() {
        return repository.findByAtivoTrue();
    }

    public Categoria buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("CategoriaNaoEncontrada"));
    }

    public Categoria salvar(Categoria categoria) {
        return repository.save(categoria);
    }

    public void inativar(Long id) {
        Categoria categoria = buscarPorId(id);
        categoria.setAtivo(false);
        repository.save(categoria);
    }
}
