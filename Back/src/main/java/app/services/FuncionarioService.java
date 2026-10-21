package app.services;

import app.models.Funcionario;
import app.repositories.FuncionarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FuncionarioService {

    private final FuncionarioRepository repository;

    public FuncionarioService(FuncionarioRepository repository) {
        this.repository = repository;
    }

    public Funcionario criar(Funcionario funcionario) {
        funcionario.setAtivo(true);
        return repository.save(funcionario);
    }

    public List<Funcionario> listarAtivos() {
        return repository.findByAtivoTrue();
    }

    public Funcionario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));
    }

    public Funcionario atualizar(Long id, Funcionario dadosAtualizados) {
        Funcionario existente = buscarPorId(id);
        existente.setNome(dadosAtualizados.getNome());
        existente.setEmail(dadosAtualizados.getEmail());
        existente.setPerfil(dadosAtualizados.getPerfil());
        return repository.save(existente);
    }

    public void desativar(Long id) {
        Funcionario existente = buscarPorId(id);
        if ("ADMIN".equals(existente.getPerfil())) {
            throw new RuntimeException("Proteção: Não é possível desativar um administrador.");
        }
        existente.setAtivo(false);
        repository.save(existente);
    }
}