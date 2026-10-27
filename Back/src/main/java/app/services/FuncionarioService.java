package app.services;

import br.ufpr.backend.models.Funcionario;
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
        funcionario.getUsuario().setAtivo(true);
        return repository.save(funcionario);
    }

    public List<Funcionario> listarAtivos() {
        return repository.findByUsuarioAtivoTrue();
    }

    public Funcionario buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));
    }

    public Funcionario atualizar(Integer id, Funcionario dadosAtualizados) {
        Funcionario existente = buscarPorId(id);
        existente.getUsuario().setNome(dadosAtualizados.getUsuario().getNome());
        existente.getUsuario().setEmail(dadosAtualizados.getUsuario().getEmail());
        existente.setDataNascimento(dadosAtualizados.getDataNascimento());
        return repository.save(existente);
    }

    public void desativar(Integer id) {
        Funcionario existente = buscarPorId(id);
        existente.getUsuario().setAtivo(false);
        repository.save(existente);
    }
}