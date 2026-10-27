package br.ufpr.backend.services;

import java.sql.*;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.*;

/** Dados das telas obtidos exclusivamente das tabelas SQL. */
@Service
public class DadosService {
    private final JdbcTemplate jdbc;
    public DadosService(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public record Funcionario(Integer id, String nome, String email, String nascimento) {}
    public record Endereco(String cep, String logradouro, String numero, String complemento,
                           String bairro, String cidade, String uf) {}
    public record Cliente(Integer id, String nome, String email, String cpf, String telefone,
                          boolean ativo, Endereco endereco) {}
    public record Historico(String dataHora, String estado, String funcionario, String descricao) {}
    public record Solicitacao(Integer id, Integer clienteId, Integer categoriaId, String dataHora,
        String equipamento, String descricao, String estado, String categoria, String cliente,
        String email, String telefone, String cpf, String endereco, java.math.BigDecimal valorOrcamento,
        Integer funcionarioDestinoId, List<Historico> historico) {}
    public record Abertura(Integer clienteId, Integer categoriaId, String equipamento, String descricao) {}

    public List<Funcionario> funcionarios() {
        return jdbc.query("SELECT u.id, u.nome, u.email, f.data_nascimento FROM funcionario f JOIN usuario u ON u.id=f.usuario_id WHERE u.ativo=true ORDER BY u.id",
            (r, n) -> new Funcionario(r.getInt("id"), r.getString("nome"), r.getString("email"), r.getString("data_nascimento")));
    }
    public List<Cliente> clientes() {
        return jdbc.query("SELECT u.id, u.nome, u.email, u.ativo, c.cpf, c.telefone, e.* FROM cliente c JOIN usuario u ON u.id=c.usuario_id JOIN endereco e ON e.id=c.endereco_id WHERE u.ativo=true ORDER BY u.id",
            (r, n) -> new Cliente(r.getInt(1), r.getString("nome"), r.getString("email"), r.getString("cpf"), r.getString("telefone"), r.getBoolean("ativo"),
                new Endereco(r.getString("cep"), r.getString("logradouro"), r.getString("numero"), r.getString("complemento"), r.getString("bairro"), r.getString("cidade"), r.getString("uf"))));
    }
    public List<Historico> historico(int id) {
        return jdbc.query("SELECT h.*, u.nome FROM historico_solicitacao h JOIN usuario u ON u.id=h.autor_id WHERE h.solicitacao_id=? ORDER BY h.data_hora, h.id",
            (r, n) -> new Historico(r.getTimestamp("data_hora").toInstant().toString(), r.getString("estado_novo"), r.getString("nome"), r.getString("observacao")), id);
    }
    public List<Solicitacao> solicitacoes() {
        return jdbc.query("""
            SELECT s.*, c.cpf, c.telefone, u.nome AS cliente, u.email, cat.nome AS categoria,
                   e.logradouro, e.numero, e.cidade
            FROM solicitacao s JOIN cliente c ON c.usuario_id=s.cliente_id
            JOIN usuario u ON u.id=c.usuario_id JOIN categoria cat ON cat.id=s.categoria_id
            JOIN endereco e ON e.id=c.endereco_id ORDER BY s.data_hora_abertura, s.id
            """, (r, n) -> new Solicitacao(r.getInt("id"), r.getInt("cliente_id"), r.getInt("categoria_id"),
                r.getTimestamp("data_hora_abertura").toInstant().toString(), r.getString("descricao_equipamento"), r.getString("descricao_defeito"),
                r.getString("estado"), r.getString("categoria"), r.getString("cliente"), r.getString("email"), r.getString("telefone"), r.getString("cpf"),
                r.getString("logradouro") + ", " + r.getString("numero") + " - " + r.getString("cidade"), r.getBigDecimal("valor_orcado"),
                (Integer) r.getObject("funcionario_responsavel_id"), historico(r.getInt("id"))));
    }
    private int inserir(String sql, Object... args) {
        var key = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            var statement = connection.prepareStatement(sql, new String[]{"id"});
            for (int i=0; i<args.length; i++) statement.setObject(i+1, args[i]);
            return statement;
        }, key);
        return Objects.requireNonNull(key.getKey()).intValue();
    }
    private String texto(String valor) {
        if (valor == null || valor.isBlank()) throw new ResponseStatusException(BAD_REQUEST, "Campo obrigatório ausente");
        return valor.trim();
    }
    @Transactional
    public Funcionario salvarFuncionario(Integer id, Funcionario f) {
        String nome = texto(f.nome());
        String email = texto(f.email()).toLowerCase(Locale.ROOT);
        var nascimento = java.time.LocalDate.parse(texto(f.nascimento()));
        if (id == null) {
            id = inserir("INSERT INTO usuario(nome,email,ativo) VALUES(?,?,true)", nome, email);
            jdbc.update("INSERT INTO funcionario(usuario_id,data_nascimento) VALUES(?,?)", id, nascimento);
        } else {
            if (jdbc.queryForObject("SELECT COUNT(*) FROM funcionario WHERE usuario_id=?", Integer.class, id) == 0)
                throw new ResponseStatusException(NOT_FOUND, "Funcionário não encontrado");
            jdbc.update("UPDATE usuario SET nome=?,email=? WHERE id=?", nome, email, id);
            jdbc.update("UPDATE funcionario SET data_nascimento=? WHERE usuario_id=?", nascimento, id);
        }
        return new Funcionario(id, nome, email, nascimento.toString());
    }
    @Transactional
    public void removerFuncionario(int id) {
        // Bloqueia a lista para duas remoções simultâneas não eliminarem o último funcionário.
        var ativos = jdbc.queryForList("SELECT u.id FROM usuario u JOIN funcionario f ON f.usuario_id=u.id WHERE u.ativo=true FOR UPDATE", Integer.class);
        if (!ativos.contains(id)) throw new ResponseStatusException(NOT_FOUND, "Funcionário não encontrado");
        if (ativos.size() <= 1) throw new ResponseStatusException(CONFLICT, "É necessário manter um funcionário ativo");
        jdbc.update("UPDATE usuario SET ativo=false WHERE id=?", id);
    }
    @Transactional
    public Cliente salvarCliente(Integer id, Cliente c) {
        String nome = texto(c.nome()), email = texto(c.email()).toLowerCase(Locale.ROOT);
        Endereco e = Objects.requireNonNull(c.endereco());
        if (id == null) {
            int enderecoId = inserir("INSERT INTO endereco(cep,logradouro,numero,complemento,bairro,cidade,uf) VALUES(?,?,?,?,?,?,?)",
                e.cep(), e.logradouro(), e.numero(), e.complemento(), e.bairro(), e.cidade(), e.uf());
            id = inserir("INSERT INTO usuario(nome,email,ativo) VALUES(?,?,true)", nome, email);
            jdbc.update("INSERT INTO cliente(usuario_id,cpf,telefone,endereco_id) VALUES(?,?,?,?)", id, texto(c.cpf()), texto(c.telefone()), enderecoId);
        } else {
            var enderecos = jdbc.queryForList("SELECT endereco_id FROM cliente WHERE usuario_id=?", Integer.class, id);
            if (enderecos.isEmpty()) throw new ResponseStatusException(NOT_FOUND, "Cliente não encontrado");
            jdbc.update("UPDATE usuario SET nome=?,email=? WHERE id=?", nome, email, id);
            jdbc.update("UPDATE cliente SET cpf=?,telefone=? WHERE usuario_id=?", texto(c.cpf()), texto(c.telefone()), id);
            jdbc.update("UPDATE endereco SET cep=?,logradouro=?,numero=?,complemento=?,bairro=?,cidade=?,uf=? WHERE id=?",
                e.cep(), e.logradouro(), e.numero(), e.complemento(), e.bairro(), e.cidade(), e.uf(), enderecos.get(0));
        }
        return new Cliente(id, nome, email, c.cpf(), c.telefone(), true, e);
    }
    @Transactional
    public int abrir(Abertura a) {
        if (a.clienteId() == null || a.categoriaId() == null) throw new ResponseStatusException(BAD_REQUEST, "Informe cliente e categoria");
        if (jdbc.queryForObject("SELECT COUNT(*) FROM cliente c JOIN usuario u ON u.id=c.usuario_id WHERE c.usuario_id=? AND u.ativo=true", Integer.class, a.clienteId()) == 0
            || jdbc.queryForObject("SELECT COUNT(*) FROM categoria WHERE id=? AND ativo=true", Integer.class, a.categoriaId()) == 0)
            throw new ResponseStatusException(BAD_REQUEST, "Cliente ou categoria inválidos");
        int id = inserir("INSERT INTO solicitacao(cliente_id,categoria_id,descricao_equipamento,descricao_defeito,estado) VALUES(?,?,?,?,'ABERTA')",
            a.clienteId(), a.categoriaId(), texto(a.equipamento()), texto(a.descricao()));
        jdbc.update("INSERT INTO historico_solicitacao(solicitacao_id,estado_novo,autor_id,observacao) VALUES(?,'ABERTA',?,'Solicitação aberta')", id, a.clienteId());
        return id;
    }
    @Transactional
    public void mudarEstado(int id, String estado, Integer autorId) {
        var registros = jdbc.queryForList("SELECT estado,cliente_id FROM solicitacao WHERE id=? FOR UPDATE", id);
        if (registros.isEmpty()) throw new ResponseStatusException(NOT_FOUND, "Solicitação não encontrada");
        String anterior = registros.get(0).get("estado").toString();
        if (!(anterior.equals("REJEITADA") && "APROVADA".equals(estado)) && !(anterior.equals("PAGA") && "FINALIZADA".equals(estado)))
            throw new ResponseStatusException(CONFLICT, "Transição de estado inválida");
        if ("APROVADA".equals(estado)) autorId = ((Number) registros.get(0).get("cliente_id")).intValue();
        if (autorId == null || ("FINALIZADA".equals(estado) && jdbc.queryForObject("SELECT COUNT(*) FROM funcionario f JOIN usuario u ON u.id=f.usuario_id WHERE f.usuario_id=? AND u.ativo=true", Integer.class, autorId) == 0))
            throw new ResponseStatusException(BAD_REQUEST, "Informe o funcionário responsável");
        jdbc.update("UPDATE solicitacao SET estado=?,data_hora_finalizacao=CASE WHEN ?='FINALIZADA' THEN CURRENT_TIMESTAMP ELSE data_hora_finalizacao END WHERE id=?", estado, estado, id);
        jdbc.update("INSERT INTO historico_solicitacao(solicitacao_id,estado_anterior,estado_novo,autor_id,observacao) VALUES(?,?,?,?,?)",
            id, anterior, estado, autorId, "Alteração de " + anterior + " para " + estado);
    }
}
