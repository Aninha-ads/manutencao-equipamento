package br.ufpr.backend.services;

import java.nio.file.*;
import br.ufpr.backend.security.AuthenticatedUser;
import br.ufpr.backend.security.SessionTokenService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:dados;MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=none"
})
@AutoConfigureMockMvc
class DadosServiceTest {
    @Autowired DadosService dados;
    @Autowired JdbcTemplate jdbc;
    @Autowired MockMvc api;
    @Autowired SessionTokenService tokens;

    private AuthenticatedUser cliente(int id) {
        return new AuthenticatedUser(id, "Cliente de teste", "cliente@exemplo.com", AuthenticatedUser.CLIENTE);
    }

    private AuthenticatedUser funcionario() {
        return new AuthenticatedUser(5, "Funcionário de teste", "funcionario@exemplo.com", AuthenticatedUser.FUNCIONARIO);
    }

    @BeforeEach void preparar() throws Exception {
        jdbc.execute("DROP ALL OBJECTS");
        // Usa os próprios scripts SQL de produção, retirando apenas opções exclusivas do MySQL.
        for (String arquivo : new String[]{"schema.sql", "seed.sql"}) {
            String sql = Files.readString(Path.of("database", arquivo))
                .replaceAll("(?m)^--.*$", "")
                .replaceAll("ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs", "")
                .replace("SET time_zone = '+00:00';", "")
                .replace("START TRANSACTION;", "").replace("COMMIT;", "");
            for (String comando : sql.split(";")) if (!comando.isBlank()) jdbc.execute(comando);
        }
    }

    @Test void leMassaDasTabelasComRelacionamentosEHistorico() {
        assertEquals(4, dados.clientes().size());
        assertEquals(2, dados.funcionarios().size());
        assertEquals(5, dados.funcionarios().get(0).id());
        assertEquals(20, dados.solicitacoes().size());
        assertEquals(65, dados.solicitacoes().stream().mapToInt(s -> s.historico().size()).sum());
        assertEquals("Ana Silva", dados.solicitacoes().get(0).cliente());
        assertEquals("Notebook", dados.solicitacoes().get(0).categoria());
        assertEquals("ABERTA", dados.solicitacoes().get(0).estado());
        jdbc.update("UPDATE usuario SET nome='Nome vindo do SQL' WHERE id=5");
        assertEquals("Nome vindo do SQL", dados.funcionarios().get(0).nome());
    }

    @Test void apiRetornaContratoDasTelasComCodigosDeEstadoDoSql() throws Exception {
        api.perform(get("/api/dados")
                .header("Authorization", "Bearer " + tokens.issue(funcionario()).value()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.clientes.length()").value(4))
            .andExpect(jsonPath("$.funcionarios.length()").value(2))
            .andExpect(jsonPath("$.categorias.length()").value(5))
            .andExpect(jsonPath("$.solicitacoes.length()").value(20))
            .andExpect(jsonPath("$.funcionarios[0].id").value(5))
            .andExpect(jsonPath("$.solicitacoes[1].estado").value("ORCADA"))
            .andExpect(jsonPath("$.solicitacoes[0].historico[0].estado").value("ABERTA"));
        api.perform(get("/api/categorias")).andExpect(status().isOk());
    }

    @Test void autenticaFuncionarioCriadoPelaApiComCredenciaisPersistidas() throws Exception {
        String cadastro = """
            {"nome":"Funcionário de teste","email":"auth@exemplo.com",
             "senha":"senha-segura-123","nascimento":"1990-01-02"}
            """;

        String tokenAutor = tokens.issue(funcionario()).value();
        api.perform(post("/api/funcionarios")
                .header("Authorization", "Bearer " + tokenAutor)
                .contentType(MediaType.APPLICATION_JSON)
                .content(cadastro))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.email").value("auth@exemplo.com"))
            .andExpect(jsonPath("$.token").doesNotExist());
        assertEquals(5, tokens.resolve(tokenAutor).id());

        String hash = jdbc.queryForObject(
            "SELECT senha_hash FROM usuario WHERE email=?",
            String.class, "auth@exemplo.com");
        assertNotNull(hash);
        assertNotEquals("senha-segura-123", hash);

        api.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email":"auth@exemplo.com","senha":"senha-segura-123"}
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("auth@exemplo.com"))
            .andExpect(jsonPath("$.perfil").value("FUNCIONARIO"));
    }

    @Test void impedeCadastroDeFuncionarioSemSessaoOuComPerfilCliente() throws Exception {
        String cadastro = """
            {"nome":"Sem permissão","email":"bloqueado@exemplo.com",
             "senha":"senha-segura-123","nascimento":"1990-01-02"}
            """;
        api.perform(post("/api/funcionarios")
                .contentType(MediaType.APPLICATION_JSON).content(cadastro))
            .andExpect(status().isUnauthorized());
        api.perform(post("/api/funcionarios")
                .header("Authorization", "Bearer " + tokens.issue(cliente(1)).value())
                .contentType(MediaType.APPLICATION_JSON).content(cadastro))
            .andExpect(status().isForbidden());
        assertEquals(0, jdbc.queryForObject(
                "SELECT COUNT(*) FROM usuario WHERE email='bloqueado@exemplo.com'", Integer.class));
    }

    @Test void removeAutocadastroDeFuncionarioMesmoParaUsuarioAutenticado() throws Exception {
        String cadastro = """
            {"nome":"Sem permissão","email":"antigo@exemplo.com",
             "senha":"senha-segura-123","dataNascimento":"1990-01-02"}
            """;
        api.perform(post("/api/auth/cadastro")
                .contentType(MediaType.APPLICATION_JSON).content(cadastro))
            .andExpect(status().isUnauthorized());
        for (var user : new AuthenticatedUser[]{cliente(1), funcionario()}) {
            api.perform(post("/api/auth/cadastro")
                    .header("Authorization", "Bearer " + tokens.issue(user).value())
                    .contentType(MediaType.APPLICATION_JSON).content(cadastro))
                .andExpect(status().isNotFound());
        }
        assertEquals(0, jdbc.queryForObject(
                "SELECT COUNT(*) FROM usuario WHERE email='antigo@exemplo.com'", Integer.class));
    }

    @Test void impedeFuncionarioInativoDeCadastrarOutraConta() throws Exception {
        String token = tokens.issue(funcionario()).value();
        jdbc.update("UPDATE usuario SET ativo=false WHERE id=5");
        api.perform(post("/api/funcionarios")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"nome":"Bloqueado","email":"inativo@exemplo.com",
                     "senha":"senha-segura-123","nascimento":"1990-01-02"}
                    """))
            .andExpect(status().isUnauthorized());
        assertNull(tokens.resolve(token));
    }

    @Test void cadastroUsaAutoIncrementESalvaHistoricoNaMesmaTransacao() {
        int id = dados.abrir(new DadosService.Abertura(1, 1, "Monitor", "Não liga"), cliente(1));
        assertTrue(id > 20);
        assertEquals("ABERTA", jdbc.queryForObject("SELECT estado FROM solicitacao WHERE id=?", String.class, id));
        assertEquals(1, dados.historico(id).size());
        assertThrows(ResponseStatusException.class, () -> dados.abrir(new DadosService.Abertura(999, 1, "Inválido", "Falha"), cliente(999)));
        assertEquals(21, dados.solicitacoes().size());
    }

    @Test void historicoDistingueClienteDeFuncionarioERegistraDestinoDoRedirecionamento() throws Exception {
        int id = dados.abrir(new DadosService.Abertura(1, 1, "Notebook", "Não liga"), cliente(1));
        assertNull(dados.historico(id).get(0).funcionario());

        dados.mudarEstado(id, new DadosService.MudancaEstado(
                "ORCADA", new java.math.BigDecimal("250.00"), null, null, null, null), funcionario());
        assertEquals("Maria Técnica", dados.historico(id).get(1).funcionario());
        assertNull(dados.historico(id).get(0).funcionario());

        dados.mudarEstado(id, new DadosService.MudancaEstado(
                "REJEITADA", null, "Valor alto", null, null, null), cliente(1));
        dados.mudarEstado(id, new DadosService.MudancaEstado(
                "APROVADA", null, null, null, null, null), cliente(1));
        assertNull(dados.historico(id).get(2).funcionario());
        assertNull(dados.historico(id).get(3).funcionario());

        dados.mudarEstado(id, new DadosService.MudancaEstado(
                "REDIRECIONADA", null, null, null, null, 6), funcionario());
        var redirecionamento = dados.historico(id).get(4);
        assertEquals("Mário Técnico", redirecionamento.funcionario());
        assertEquals("Maria Técnica", redirecionamento.funcionarioOrigem());
        assertEquals("Mário Técnico", redirecionamento.funcionarioDestino());

        var destino = new AuthenticatedUser(6, "Mário Técnico", "mario@example.test", AuthenticatedUser.FUNCIONARIO);
        dados.mudarEstado(id, new DadosService.MudancaEstado(
                "ARRUMADA", null, null, "Reparo concluído", "Manter limpo", null), destino);
        dados.mudarEstado(id, new DadosService.MudancaEstado(
                "PAGA", null, null, null, null, null), cliente(1));
        assertEquals("Mário Técnico", dados.historico(id).get(5).funcionario());
        assertNull(dados.historico(id).get(6).funcionario());
        assertEquals(1, jdbc.queryForObject(
                "SELECT autor_id FROM historico_solicitacao WHERE solicitacao_id=? AND estado_novo='ABERTA'",
                Integer.class, id));

        api.perform(get("/api/solicitacoes")
                .header("Authorization", "Bearer " + tokens.issue(cliente(1)).value()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[?(@.id == " + id + ")].historico[0].funcionario").value(org.hamcrest.Matchers.contains(org.hamcrest.Matchers.nullValue())))
            .andExpect(jsonPath("$[?(@.id == " + id + ")].historico[4].funcionario").value(org.hamcrest.Matchers.contains("Mário Técnico")));
    }

    @Test void inativaFuncionarioSemQuebrarReferenciasEImpedeRemoverUltimo() {
        dados.removerFuncionario(6);
        assertEquals(1, dados.funcionarios().size());
        assertEquals(20, dados.solicitacoes().size());
        assertThrows(ResponseStatusException.class, () -> dados.removerFuncionario(5));
    }

    @Test void persisteFinalizacaoEHistoricoAtomicamente() {
        int antes = dados.historico(7).size();
        var finalizacao = new DadosService.MudancaEstado("FINALIZADA", null, null, null, null, null);
        dados.mudarEstado(7, finalizacao, funcionario());
        assertEquals("FINALIZADA", jdbc.queryForObject("SELECT estado FROM solicitacao WHERE id=7", String.class));
        assertNotNull(jdbc.queryForObject("SELECT data_hora_finalizacao FROM solicitacao WHERE id=7", java.sql.Timestamp.class));
        assertEquals(antes + 1, dados.historico(7).size());
        assertThrows(ResponseStatusException.class, () -> dados.mudarEstado(1, finalizacao, funcionario()));
        assertEquals("ABERTA", jdbc.queryForObject("SELECT estado FROM solicitacao WHERE id=1", String.class));
    }
}
