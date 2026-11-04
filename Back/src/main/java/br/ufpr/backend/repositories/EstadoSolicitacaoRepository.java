package br.ufpr.backend.repositories;

import br.ufpr.backend.models.EstadoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstadoSolicitacaoRepository
        extends JpaRepository<EstadoSolicitacao, String> {
}
