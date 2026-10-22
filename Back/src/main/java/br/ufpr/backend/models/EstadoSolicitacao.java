package br.ufpr.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "estado_solicitacao")
public class EstadoSolicitacao {
    @Id
    @Column(length = 20)
    private String codigo;

    @Column(nullable = false, length = 80)
    private String descricao;

    public EstadoSolicitacao() {}

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}
