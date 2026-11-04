package app.services;

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
    }
}