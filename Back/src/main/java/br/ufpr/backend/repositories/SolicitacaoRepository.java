
package br.ufpr.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufpr.backend.models.Solicitacao;

import java.time.LocalDateTime;
import java.util.List;

public interface SolicitacaoRepository
        extends JpaRepository<Solicitacao, Integer> {

    List<Solicitacao> findByCliente_Id(Integer clienteId);

    List<Solicitacao> findByDataHoraAberturaBetween(
            LocalDateTime inicio,
            LocalDateTime fim);
}
