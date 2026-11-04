package br.ufpr.backend.services;

import br.ufpr.backend.models.EstadoSolicitacao;
import br.ufpr.backend.models.Solicitacao;
import br.ufpr.backend.repositories.EstadoSolicitacaoRepository;
import br.ufpr.backend.repositories.SolicitacaoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final EstadoSolicitacaoRepository estadoRepository;

    public SolicitacaoService(
            SolicitacaoRepository solicitacaoRepository,
            EstadoSolicitacaoRepository estadoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.estadoRepository = estadoRepository;
    }

    public Solicitacao abrirSolicitacao(Solicitacao solicitacao) {
        if (solicitacao.getCliente() == null || solicitacao.getCategoria() == null) {
            throw new IllegalArgumentException(
                    "Cliente e categoria são obrigatórios.");
        }
        if (solicitacao.getDescricaoEquipamento() == null
                || solicitacao.getDescricaoEquipamento().isBlank()
                || solicitacao.getDescricaoDefeito() == null
                || solicitacao.getDescricaoDefeito().isBlank()) {
            throw new IllegalArgumentException(
                    "As descrições do equipamento e do defeito são obrigatórias.");
        }

        EstadoSolicitacao estadoInicial = estadoRepository.findById("ABERTA")
                .orElseThrow(() -> new IllegalStateException(
                        "O estado inicial ABERTA não existe no banco de dados."));
        solicitacao.setEstado(estadoInicial);
        return solicitacaoRepository.save(solicitacao);
    }

    public List<Solicitacao> listarSolicitacoes(Integer clienteId) {
        if (clienteId != null) {
            return solicitacaoRepository.findByCliente_Id(clienteId);
        }
        return solicitacaoRepository.findAll();
    }

    public List<Solicitacao> buscarPorPeriodo(
            LocalDateTime inicio,
            LocalDateTime fim) {
        if (inicio == null || fim == null || inicio.isAfter(fim)) {
            throw new IllegalArgumentException(
                    "Informe um período válido, com início anterior ao fim.");
        }
        return solicitacaoRepository.findByDataHoraAberturaBetween(inicio, fim);
    }
}
