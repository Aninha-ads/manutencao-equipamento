package app.repositories;

import app.models.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    
   
    List<Solicitacao> findByClienteId(Long clienteId);
    
    List<Solicitacao> findByDataHoraAberturaBetween(LocalDateTime dataInicio, LocalDateTime dataFim);
}