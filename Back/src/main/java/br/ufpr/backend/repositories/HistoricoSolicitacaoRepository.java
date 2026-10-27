
package br.ufpr.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufpr.backend.models.HistoricoSolicitacao;

public interface HistoricoSolicitacaoRepository
        extends JpaRepository<HistoricoSolicitacao, Integer> {
}
