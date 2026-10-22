
package br.ufpr.backend.repositories;
import br.ufpr.backend.models.HistoricoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoricoSolicitacaoRepository
        extends JpaRepository<HistoricoSolicitacao, Integer> {
}
