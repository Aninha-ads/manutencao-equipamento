
package br.ufpr.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufpr.backend.models.Solicitacao;
<<<<<<< HEAD

import java.time.LocalDateTime;
import java.util.List;


=======
>>>>>>> 4d8446e8732d3cd0af841b5852c66c96e7193a78

public interface SolicitacaoRepository
        extends JpaRepository<Solicitacao, Integer> {

    List<Solicitacao> findByCliente_Id(Integer clienteId);

    List<Solicitacao> findByDataHoraAberturaBetween(
            LocalDateTime inicio,
            LocalDateTime fim);
}
