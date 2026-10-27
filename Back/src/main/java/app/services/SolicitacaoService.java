package app.services;

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
    }
}