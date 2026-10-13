package app.services;

import app.models.Solicitacao;
import app.repositories.SolicitacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    public Solicitacao abrirSolicitacao(Solicitacao novaSolicitacao) {
        // Valida se os dados essenciais foram enviados
        if (novaSolicitacao.getClienteId() == null || novaSolicitacao.getEquipamentoId() == null) {
            throw new IllegalArgumentException("O ID do cliente e do equipamento são obrigatórios.");
        }
        if (novaSolicitacao.getDescricaoDefeito() == null || novaSolicitacao.getDescricaoDefeito().trim().isEmpty()) {
            throw new IllegalArgumentException("A descrição do defeito é obrigatória para abrir a solicitação.");
        }

        // status inicial DEVE ser ABERTA
        novaSolicitacao.setStatus("ABERTA");
        
        //data e hora em que a manutenção foi solicitada
        novaSolicitacao.setDataHoraAbertura(LocalDateTime.now());

        // Salva a nova solicitação no banco de dados e retorna o objeto criado
        return solicitacaoRepository.save(novaSolicitacao);
    }
    public List<Solicitacao> listarSolicitacoes(Long clienteId) {
        if (clienteId != null) {
            return solicitacaoRepository.findByClienteId(clienteId);
        }
        return solicitacaoRepository.findAll();
    }

    public List<Solicitacao> buscarPorPeriodo(LocalDateTime dataInicio, LocalDateTime dataFim) {
        if (dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("As datas de início e fim são obrigatórias para a busca.");
        }
        if (dataInicio.isAfter(dataFim)) {
            throw new IllegalArgumentException("A data de início não pode ser posterior à data de fim.");
        }
        return solicitacaoRepository.findByDataHoraAberturaBetween(dataInicio, dataFim);
    }
}