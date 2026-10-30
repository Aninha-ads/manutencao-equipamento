package br.ufpr.backend.services;

import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import br.ufpr.backend.security.AuthenticatedUser;
import br.ufpr.backend.services.HashService;
import static org.springframework.http.HttpStatus.*;

/** Dados das telas obtidos exclusivamente das tabelas SQL. */
@Service
public class DadosService {
    private final JdbcTemplate jdbc;
    private final HashService hashService;
    public DadosService(JdbcTemplate jdbc, HashService hashService) {
        this.jdbc = jdbc;
        this.hashService = hashService;
    }

    public record Funcionario(Integer id, String nome, String email, String nascimento) {}
    public record Endereco(String cep, String logradouro, String numero, String complemento,
                           String bairro, String cidade, String uf) {}
    public record Cliente(Integer id, String nome, String email, String cpf, String telefone,
                          boolean ativo, Endereco endereco) {}
    public record Historico(String dataHora, String estado, String funcionario, String descricao,
                            String funcionarioOrigem, String funcionarioDestino) {}
    public record Solicitacao(Integer id, Integer clienteId, Integer categoriaId, String dataHora,
        String equipamento, String descricao, String estado, String categoria, String cliente,
        String email, String telefone, String cpf, String endereco, java.math.BigDecimal valorOrcamento,
        Integer funcionarioDestinoId, List<Historico> historico) {}
    public record Abertura(Integer clienteId, Integer categoriaId, String equipamento, String descricao) {}
    public record MudancaEstado(String estado, java.math.BigDecimal valorOrcamento,
                                String motivoRejeicao, String descricaoManutencao,
                                String orientacoesCliente, Integer funcionarioDestinoId) {}

    public List<Funcionario> funcionarios() {
        return jdbc.query("SELECT u.id, u.nome, u.email, f.data_nascimento FROM funcionario f JOIN usuario u ON u.id=f.usuario_id WHERE u.ativo=true ORDER BY u.id",
            (r, n) -> new Funcionario(r.getInt("id"), r.getString("nome"), r.getString("email"), r.getString("data_nascimento")));
    }
    public List<Cliente> clientes() {
        return jdbc.query("SELECT u.id, u.nome, u.email, u.ativo, c.cpf, c.telefone, e.* FROM cliente c JOIN usuario u ON u.id=c.usuario_id JOIN endereco e ON e.id=c.endereco_id WHERE u.ativo=true ORDER BY u.id",
            (r, n) -> new Cliente(r.getInt(1), r.getString("nome"), r.getString("email"), r.getString("cpf"), r.getString("telefone"), r.getBoolean("ativo"),
                new Endereco(r.getString("cep"), r.getString("logradouro"), r.getString("numero"), r.getString("complemento"), r.getString("bairro"), r.getString("cidade"), r.getString("uf"))));
    }
    public List<Cliente> clientes(Integer id) {
        return jdbc.query("SELECT u.id, u.nome, u.email, u.ativo, c.cpf, c.telefone, e.* FROM cliente c JOIN usuario u ON u.id=c.usuario_id JOIN endereco e ON e.id=c.endereco_id WHERE u.ativo=true AND u.id=?",
            (r, n) -> new Cliente(r.getInt(1), r.getString("nome"), r.getString("email"), r.getString("cpf"), r.getString("telefone"), r.getBoolean("ativo"),
                new Endereco(r.getString("cep"), r.getString("logradouro"), r.getString("numero"), r.getString("complemento"), r.getString("bairro"), r.getString("cidade"), r.getString("uf"))), id);
    }
    public List<Historico> historico(int id) {
        return jdbc.query("""
            SELECT h.*,
                   CASE
                       WHEN h.estado_novo='REDIRECIONADA' THEN destino.nome
                       WHEN h.estado_novo IN ('ORCADA','ARRUMADA','FINALIZADA') THEN autor_funcionario.nome
                       ELSE NULL
                   END AS funcionario_nome,
                   origem.nome AS origem_nome, destino.nome AS destino_nome
            FROM historico_solicitacao h
            JOIN usuario autor ON autor.id=h.autor_id
            LEFT JOIN funcionario fa ON fa.usuario_id=h.autor_id
            LEFT JOIN usuario autor_funcionario ON autor_funcionario.id=fa.usuario_id
            LEFT JOIN funcionario fo ON fo.usuario_id=h.funcionario_origem_id
            LEFT JOIN usuario origem ON origem.id=fo.usuario_id
            LEFT JOIN funcionario fd ON fd.usuario_id=h.funcionario_destino_id
            LEFT JOIN usuario destino ON destino.id=fd.usuario_id
            WHERE h.solicitacao_id=? ORDER BY h.data_hora, h.id
            """, (r, n) -> new Historico(
                r.getTimestamp("data_hora").toInstant().toString(), r.getString("estado_novo"),
                r.getString("funcionario_nome"), r.getString("observacao"),
                r.getString("origem_nome"), r.getString("destino_nome")), id);
    }
    public List<Solicitacao> solicitacoes() {
        return solicitacoes(null);
    }
    public List<Solicitacao> solicitacoes(AuthenticatedUser user) {
        String filtroCliente = user != null && AuthenticatedUser.CLIENTE.equals(user.perfil())
                ? " WHERE s.cliente_id=?" : "";
        Object[] args = filtroCliente.isEmpty() ? new Object[0] : new Object[]{user.id()};
        return jdbc.query("""
            SELECT s.*, c.cpf, c.telefone, u.nome AS cliente, u.email, cat.nome AS categoria,
                   e.logradouro, e.numero, e.cidade
            FROM solicitacao s JOIN cliente c ON c.usuario_id=s.cliente_id
            JOIN usuario u ON u.id=c.usuario_id JOIN categoria cat ON cat.id=s.categoria_id
            JOIN endereco e ON e.id=c.endereco_id
            """ + filtroCliente + " ORDER BY s.data_hora_abertura, s.id",
            (r, n) -> new Solicitacao(r.getInt("id"), r.getInt("cliente_id"), r.getInt("categoria_id"),
                r.getTimestamp("data_hora_abertura").toInstant().toString(), r.getString("descricao_equipamento"), r.getString("descricao_defeito"),
                r.getString("estado"), r.getString("categoria"), r.getString("cliente"), r.getString("email"), r.getString("telefone"), r.getString("cpf"),
                r.getString("logradouro") + ", " + r.getString("numero") + " - " + r.getString("cidade"), r.getBigDecimal("valor_orcado"),
                (Integer) r.getObject("funcionario_responsavel_id"), historico(r.getInt("id"))), args);
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
    public Funcionario salvarFuncionario(Integer id, Funcionario f, String senha) {
        String nome = texto(f.nome());
        String email = texto(f.email()).toLowerCase(Locale.ROOT);
        var nascimento = java.time.LocalDate.parse(texto(f.nascimento()));
        if (id == null) {
            String salt = hashService.gerarSalt();
            if (senha == null || senha.length() < 6) {
                throw new ResponseStatusException(BAD_REQUEST, "A senha deve ter pelo menos 6 caracteres.");
            }
            id = inserir("INSERT INTO usuario(nome,email,senha_hash,senha_salt,ativo) VALUES(?,?,?,?,true)",
                    nome, email, hashService.gerarHash(senha, salt), salt);
            jdbc.update("INSERT INTO funcionario(usuario_id,data_nascimento) VALUES(?,?)", id, nascimento);
        } else {
            if (jdbc.queryForObject("SELECT COUNT(*) FROM funcionario WHERE usuario_id=?", Integer.class, id) == 0)
                throw new ResponseStatusException(NOT_FOUND, "Funcionário não encontrado");
            if (senha == null || senha.isBlank()) {
                jdbc.update("UPDATE usuario SET nome=?,email=? WHERE id=?", nome, email, id);
            } else {
                if (senha.length() < 6) {
                    throw new ResponseStatusException(BAD_REQUEST, "A senha deve ter pelo menos 6 caracteres.");
                }
                String salt = hashService.gerarSalt();
                jdbc.update("UPDATE usuario SET nome=?,email=?,senha_hash=?,senha_salt=? WHERE id=?",
                        nome, email, hashService.gerarHash(senha, salt), salt, id);
            }
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
    public int abrir(Abertura a, AuthenticatedUser autor) {
        exigirPerfil(autor, AuthenticatedUser.CLIENTE);
        if (a.categoriaId() == null) throw new ResponseStatusException(BAD_REQUEST, "Informe a categoria");
        if (jdbc.queryForObject("SELECT COUNT(*) FROM cliente c JOIN usuario u ON u.id=c.usuario_id WHERE c.usuario_id=? AND u.ativo=true", Integer.class, autor.id()) == 0
            || jdbc.queryForObject("SELECT COUNT(*) FROM categoria WHERE id=? AND ativo=true", Integer.class, a.categoriaId()) == 0)
            throw new ResponseStatusException(BAD_REQUEST, "Cliente ou categoria inválidos");
        int id = inserir("INSERT INTO solicitacao(cliente_id,categoria_id,descricao_equipamento,descricao_defeito,estado) VALUES(?,?,?,?,'ABERTA')",
            autor.id(), a.categoriaId(), texto(a.equipamento()), texto(a.descricao()));
        jdbc.update("INSERT INTO historico_solicitacao(solicitacao_id,estado_novo,autor_id,observacao) VALUES(?,'ABERTA',?,'Solicitação aberta')", id, autor.id());
        return id;
    }
    @Transactional
    public void mudarEstado(int id, MudancaEstado mudanca, AuthenticatedUser autor) {
        var registros = jdbc.queryForList("SELECT estado,cliente_id,funcionario_responsavel_id FROM solicitacao WHERE id=? FOR UPDATE", id);
        if (registros.isEmpty()) throw new ResponseStatusException(NOT_FOUND, "Solicitação não encontrada");
        var registro = registros.get(0);
        String anterior = registro.get("estado").toString();
        String estado = mudanca.estado();
        if (!transicaoPermitida(anterior, estado)) {
            throw new ResponseStatusException(CONFLICT, "Transição de estado inválida.");
        }

        int clienteId = ((Number) registro.get("cliente_id")).intValue();
        Integer funcionarioOrigem = (Integer) registro.get("funcionario_responsavel_id");
        String observacao = "Alteração de " + anterior + " para " + estado;
        switch (estado) {
            case "ORCADA" -> {
                exigirPerfil(autor, AuthenticatedUser.FUNCIONARIO);
                if (mudanca.valorOrcamento() == null || mudanca.valorOrcamento().signum() <= 0) {
                    throw new ResponseStatusException(BAD_REQUEST, "O valor do orçamento deve ser positivo.");
                }
                jdbc.update("UPDATE solicitacao SET estado=?,valor_orcado=?,funcionario_responsavel_id=? WHERE id=?",
                        estado, mudanca.valorOrcamento(), autor.id(), id);
            }
            case "APROVADA" -> {
                exigirClienteDaSolicitacao(autor, clienteId);
                jdbc.update("UPDATE solicitacao SET estado=? WHERE id=?", estado, id);
            }
            case "REJEITADA" -> {
                exigirClienteDaSolicitacao(autor, clienteId);
                observacao = texto(mudanca.motivoRejeicao());
                jdbc.update("UPDATE solicitacao SET estado=?,motivo_rejeicao=? WHERE id=?",
                        estado, observacao, id);
            }
            case "REDIRECIONADA" -> {
                exigirPerfil(autor, AuthenticatedUser.FUNCIONARIO);
                Integer destino = mudanca.funcionarioDestinoId();
                if (destino == null || destino.equals(autor.id())
                        || jdbc.queryForObject("""
                            SELECT COUNT(*) FROM funcionario f JOIN usuario u ON u.id=f.usuario_id
                            WHERE f.usuario_id=? AND u.ativo=true
                            """, Integer.class, destino) == 0) {
                    throw new ResponseStatusException(BAD_REQUEST, "Selecione um funcionário ativo diferente do atual.");
                }
                jdbc.update("UPDATE solicitacao SET estado=?,funcionario_responsavel_id=? WHERE id=?",
                        estado, destino, id);
                observacao = "Solicitação redirecionada.";
                registrarHistorico(id, anterior, estado, autor.id(), funcionarioOrigem, destino, observacao);
                return;
            }
            case "ARRUMADA" -> {
                exigirPerfil(autor, AuthenticatedUser.FUNCIONARIO);
                String descricao = texto(mudanca.descricaoManutencao());
                String orientacoes = texto(mudanca.orientacoesCliente());
                jdbc.update("""
                    UPDATE solicitacao SET estado=?,descricao_manutencao=?,orientacoes_cliente=?
                    WHERE id=?
                    """, estado, descricao, orientacoes, id);
                observacao = descricao + " — Orientações: " + orientacoes;
            }
            case "PAGA" -> {
                exigirClienteDaSolicitacao(autor, clienteId);
                jdbc.update("UPDATE solicitacao SET estado=?,data_hora_pagamento=CURRENT_TIMESTAMP WHERE id=?",
                        estado, id);
            }
            case "FINALIZADA" -> {
                exigirPerfil(autor, AuthenticatedUser.FUNCIONARIO);
                jdbc.update("UPDATE solicitacao SET estado=?,data_hora_finalizacao=CURRENT_TIMESTAMP WHERE id=?",
                        estado, id);
            }
            default -> throw new ResponseStatusException(CONFLICT, "Transição de estado inválida.");
        }
        registrarHistorico(id, anterior, estado, autor.id(), null, null, observacao);
    }

    private boolean transicaoPermitida(String anterior, String proximo) {
        return switch (anterior) {
            case "ABERTA" -> "ORCADA".equals(proximo);
            case "ORCADA" -> "APROVADA".equals(proximo) || "REJEITADA".equals(proximo);
            case "REJEITADA" -> "APROVADA".equals(proximo);
            case "APROVADA" -> "REDIRECIONADA".equals(proximo) || "ARRUMADA".equals(proximo);
            case "REDIRECIONADA" -> "ARRUMADA".equals(proximo);
            case "ARRUMADA" -> "PAGA".equals(proximo);
            case "PAGA" -> "FINALIZADA".equals(proximo);
            default -> false;
        };
    }

    private void exigirPerfil(AuthenticatedUser user, String perfil) {
        if (user == null || !perfil.equals(user.perfil())) {
            throw new ResponseStatusException(FORBIDDEN, "Perfil sem permissão para esta operação.");
        }
    }

    private void exigirClienteDaSolicitacao(AuthenticatedUser user, int clienteId) {
        exigirPerfil(user, AuthenticatedUser.CLIENTE);
        if (!user.id().equals(clienteId)) {
            throw new ResponseStatusException(FORBIDDEN, "A solicitação pertence a outro cliente.");
        }
    }

    private void registrarHistorico(int solicitacaoId, String anterior, String estado, int autorId,
                                    Integer origemId, Integer destinoId, String observacao) {
        jdbc.update("""
            INSERT INTO historico_solicitacao(
                solicitacao_id,estado_anterior,estado_novo,autor_id,
                funcionario_origem_id,funcionario_destino_id,observacao
            ) VALUES(?,?,?,?,?,?,?)
            """, solicitacaoId, anterior, estado, autorId, origemId, destinoId, observacao);
    }
}
