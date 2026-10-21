package br.ufpr.backend.models;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historico_solicitacao")
public class HistoricoSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    @Column(name = "data_hora",
            nullable = false, insertable = false, updatable = false)
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(
        name = "estado_anterior",
        referencedColumnName = "codigo"
    )
    private EstadoSolicitacao estadoAnterior;

    @ManyToOne(optional = false)
    @JoinColumn(
        name = "estado_novo",
        referencedColumnName = "codigo",
        nullable = false
    )
    private EstadoSolicitacao estadoNovo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "autor_id", nullable = false)
    private Usuario autor;

    @ManyToOne
    @JoinColumn(
        name = "funcionario_origem_id",
        referencedColumnName = "usuario_id"
    )
    private Funcionario funcionarioOrigem;

    @ManyToOne
    @JoinColumn(
        name = "funcionario_destino_id",
        referencedColumnName = "usuario_id"
    )
    private Funcionario funcionarioDestino;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    public HistoricoSolicitacao() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(Solicitacao solicitacao) {
        this.solicitacao = solicitacao;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public EstadoSolicitacao getEstadoAnterior() {
        return estadoAnterior;
    }

    public void setEstadoAnterior(EstadoSolicitacao estadoAnterior) {
        this.estadoAnterior = estadoAnterior;
    }

    public EstadoSolicitacao getEstadoNovo() {
        return estadoNovo;
    }

    public void setEstadoNovo(EstadoSolicitacao estadoNovo) {
        this.estadoNovo = estadoNovo;
    }

    public Usuario getAutor() {
        return autor;
    }

    public void setAutor(Usuario autor) {
        this.autor = autor;
    }

    public Funcionario getFuncionarioOrigem() {
        return funcionarioOrigem;
    }

    public void setFuncionarioOrigem(Funcionario funcionarioOrigem) {
        this.funcionarioOrigem = funcionarioOrigem;
    }

    public Funcionario getFuncionarioDestino() {
        return funcionarioDestino;
    }

    public void setFuncionarioDestino(Funcionario funcionarioDestino) {
        this.funcionarioDestino = funcionarioDestino;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
