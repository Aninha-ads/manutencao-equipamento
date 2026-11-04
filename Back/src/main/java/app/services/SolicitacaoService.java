package app.services;

<<<<<<< HEAD
import app.models.Solicitacao;
import app.repositories.SolicitacaoRepository;
import org.springframework.stereotype.Service;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public Solicitacao buscarPorId(Long id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada."));
    }

    public Solicitacao registrarPagamento(Long id) {
        Solicitacao solicitacao = buscarPorId(id);
        
       
        if (!"CONCLUIDA".equals(solicitacao.getStatus()) && !"AGUARDANDO_PAGAMENTO".equals(solicitacao.getStatus())) {
            throw new RuntimeException("Transição inválida: Apenas solicitações concluídas podem ser pagas.");
        }
        
        
        solicitacao.setStatus("PAGA");
        return solicitacaoRepository.save(solicitacao);
    }

    public Solicitacao finalizarSolicitacao(Long id) {
        Solicitacao solicitacao = buscarPorId(id);
        
        if (!"PAGA".equals(solicitacao.getStatus())) {
            throw new RuntimeException("Transição inválida: A solicitação deve estar PAGA antes de ser finalizada.");
        }
        
        
        solicitacao.setStatus("FINALIZADA");
        return solicitacaoRepository.save(solicitacao);
=======
import org.springframework.stereotype.Service;

import br.ufpr.backend.models.Solicitacao;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitacaoService {

    private final br.ufpr.backend.services.SolicitacaoService backendService;

    public SolicitacaoService(
            br.ufpr.backend.services.SolicitacaoService backendService) {
        this.backendService = backendService;
    }

    public Solicitacao abrirSolicitacao(Solicitacao solicitacao) {
        return backendService.abrirSolicitacao(solicitacao);
    }

    public List<Solicitacao> listarSolicitacoes(Long clienteId) {
        return backendService.listarSolicitacoes(
                clienteId == null ? null : Math.toIntExact(clienteId));
    }

    public List<Solicitacao> buscarPorPeriodo(LocalDateTime dataInicio, LocalDateTime dataFim) {
        return backendService.buscarPorPeriodo(dataInicio, dataFim);
>>>>>>> 0fc6f8fc37280887f7b33b43003e5a848c58e6b0
    }
}