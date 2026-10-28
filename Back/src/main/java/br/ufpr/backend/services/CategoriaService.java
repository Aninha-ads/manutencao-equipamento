package br.ufpr.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.ufpr.backend.models.Categoria;
import br.ufpr.backend.repositories.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;

    public List<Categoria> listarAtivas() {
        return repository.findByAtivoTrue();
    }

    public Categoria buscarPorId(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("CategoriaNaoEncontrada"));
    }

    public Categoria salvar(Categoria categoria) {
        return repository.save(categoria);
    }

    public void inativar(Integer id) {
        Categoria categoria = buscarPorId(id);
        categoria.setAtivo(false);
        repository.save(categoria);
    }

     //não consigo abrir o doumento para revisar requisitos se devemos inativar ou excluir
     //ufpr virtual fora do ar
    public void excluir(Integer id) {
    if (!repository.existsById(id)) {
        throw new RuntimeException("CategoriaNaoEncontrada");
    }

    repository.deleteById(id);
}

}
