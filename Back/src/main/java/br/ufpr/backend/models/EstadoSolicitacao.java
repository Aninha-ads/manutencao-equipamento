package br.ufpr.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "estado_solicitacao")
public class EstadoSolicitacao {
<<<<<<< HEAD

    @Id
    @Column(name = "codigo", nullable = false, length = 20)
    private String codigo;

    @Column(name = "descricao", nullable = false, length = 80)
    private String descricao;

    public EstadoSolicitacao() {
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
=======
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
>>>>>>> 4d8446e8732d3cd0af841b5852c66c96e7193a78
}
