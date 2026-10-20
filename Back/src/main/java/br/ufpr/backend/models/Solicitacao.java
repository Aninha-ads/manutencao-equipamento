
package br.ufpr.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacao")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "funcionario_responsavel_id")
    private Funcionario funcionarioResponsavel;

    @Column(name = "descricao_equipamento",
            nullable = false, columnDefinition = "TEXT")
    private String descricaoEquipamento;

    @Column(name = "descricao_defeito",
            nullable = false, columnDefinition = "TEXT")
    private String descricaoDefeito;

    @Column(name = "data_hora_abertura",
            nullable = false, insertable = false, updatable = false)
    private LocalDateTime dataHoraAbertura;

    @ManyToOne(optional = false)
    @JoinColumn(
        name = "estado",
        referencedColumnName = "codigo",
        nullable = false
    )
    private EstadoSolicitacao estado;

    @Column(name = "valor_orcado", precision = 10, scale = 2)
    private BigDecimal valorOrcado;

    @Column(name = "motivo_rejeicao", columnDefinition = "TEXT")
    private String motivoRejeicao;

    @Column(name = "descricao_manutencao", columnDefinition = "TEXT")
    private String descricaoManutencao;

    @Column(name = "orientacoes_cliente", columnDefinition = "TEXT")
    private String orientacoesCliente;

    @Column(name = "data_hora_pagamento")
    private LocalDateTime dataHoraPagamento;

    @Column(name = "data_hora_finalizacao")
    private LocalDateTime dataHoraFinalizacao;

    public Solicitacao() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Funcionario getFuncionarioResponsavel() {
        return funcionarioResponsavel;
    }

    public void setFuncionarioResponsavel(
            Funcionario funcionarioResponsavel) {
        this.funcionarioResponsavel = funcionarioResponsavel;
    }

    public String getDescricaoEquipamento() {
        return descricaoEquipamento;
    }

    public void setDescricaoEquipamento(String descricaoEquipamento) {
        this.descricaoEquipamento = descricaoEquipamento;
    }

    public String getDescricaoDefeito() {
        return descricaoDefeito;
    }

    public void setDescricaoDefeito(String descricaoDefeito) {
        this.descricaoDefeito = descricaoDefeito;
    }

    public LocalDateTime getDataHoraAbertura() {
        return dataHoraAbertura;
    }

    public EstadoSolicitacao getEstado() {
        return estado;
    }

    public void setEstado(EstadoSolicitacao estado) {
        this.estado = estado;
    }

    public BigDecimal getValorOrcado() {
        return valorOrcado;
    }

    public void setValorOrcado(BigDecimal valorOrcado) {
        this.valorOrcado = valorOrcado;
    }

    public String getMotivoRejeicao() {
        return motivoRejeicao;
    }

    public void setMotivoRejeicao(String motivoRejeicao) {
        this.motivoRejeicao = motivoRejeicao;
    }

    public String getDescricaoManutencao() {
        return descricaoManutencao;
    }

    public void setDescricaoManutencao(String descricaoManutencao) {
        this.descricaoManutencao = descricaoManutencao;
    }

    public String getOrientacoesCliente() {
        return orientacoesCliente;
    }

    public void setOrientacoesCliente(String orientacoesCliente) {
        this.orientacoesCliente = orientacoesCliente;
    }

    public LocalDateTime getDataHoraPagamento() {
        return dataHoraPagamento;
    }

    public void setDataHoraPagamento(LocalDateTime dataHoraPagamento) {
        this.dataHoraPagamento = dataHoraPagamento;
    }

    public LocalDateTime getDataHoraFinalizacao() {
        return dataHoraFinalizacao;
    }

    public void setDataHoraFinalizacao(
            LocalDateTime dataHoraFinalizacao) {
        this.dataHoraFinalizacao = dataHoraFinalizacao;
    }
}
