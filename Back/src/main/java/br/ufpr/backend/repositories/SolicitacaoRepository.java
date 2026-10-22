
package br.ufpr.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufpr.backend.models.Solicitacao;

public interface SolicitacaoRepository
        extends JpaRepository<Solicitacao, Integer> {
}
