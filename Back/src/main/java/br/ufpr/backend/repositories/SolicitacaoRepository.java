
package br.ufpr.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufpr.backend.model.Solicitacao;

public interface SolicitacaoRepository
        extends JpaRepository<Solicitacao, Integer> {
}
