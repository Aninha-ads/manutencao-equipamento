package br.ufpr.backend.repositories;

import br.ufpr.backend.models.Funcionario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {
    Optional<Funcionario> findByUsuarioEmail(String email);
    List<Funcionario> findByUsuarioAtivoTrue();
}
