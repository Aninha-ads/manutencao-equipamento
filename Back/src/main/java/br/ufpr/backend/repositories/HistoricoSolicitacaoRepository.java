
package br.ufpr.backend.repository;
import br.ufpr.backend.model.HistoricoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoricoSolicitacaoRepository
        extends JpaRepository<HistoricoSolicitacao, Integer> {
}
