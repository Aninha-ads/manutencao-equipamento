package app.repositories;

<<<<<<< HEAD
import app.models.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
}
=======
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.ufpr.backend.models.Solicitacao;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Integer> {
    
   
    List<Solicitacao> findByCliente_Id(Integer clienteId);
    
    List<Solicitacao> findByDataHoraAberturaBetween(LocalDateTime dataInicio, LocalDateTime dataFim);
}

>>>>>>> 0fc6f8fc37280887f7b33b43003e5a848c58e6b0
