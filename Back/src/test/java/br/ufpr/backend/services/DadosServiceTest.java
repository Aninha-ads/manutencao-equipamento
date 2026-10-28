package br.ufpr.backend.services;

import java.nio.file.*;
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
    "spring.jpa.hibernate.ddl-auto=none"
})
@AutoConfigureMockMvc
class DadosServiceTest {
    @Autowired DadosService dados;
    @Autowired JdbcTemplate jdbc;
    @Autowired MockMvc api;

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
        api.perform(get("/api/dados"))
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
             "senha":"senha-segura-123","dataNascimento":"1990-01-02"}
            """;

        api.perform(post("/api/auth/cadastro")
                .contentType(MediaType.APPLICATION_JSON)
                .content(cadastro))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.email").value("auth@exemplo.com"))
            .andExpect(jsonPath("$.perfil").value("FUNCIONARIO"));

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
            .andExpect(jsonPath("$.email").value("auth@exemplo.com"));
    }

    @Test void cadastroUsaAutoIncrementESalvaHistoricoNaMesmaTransacao() {
        int id = dados.abrir(new DadosService.Abertura(1, 1, "Monitor", "Não liga"));
        assertTrue(id > 20);
        assertEquals("ABERTA", jdbc.queryForObject("SELECT estado FROM solicitacao WHERE id=?", String.class, id));
        assertEquals(1, dados.historico(id).size());
        assertThrows(ResponseStatusException.class, () -> dados.abrir(new DadosService.Abertura(999, 1, "Inválido", "Falha")));
        assertEquals(21, dados.solicitacoes().size());
    }

    @Test void inativaFuncionarioSemQuebrarReferenciasEImpedeRemoverUltimo() {
        dados.removerFuncionario(6);
        assertEquals(1, dados.funcionarios().size());
        assertEquals(20, dados.solicitacoes().size());
        assertThrows(ResponseStatusException.class, () -> dados.removerFuncionario(5));
    }

    @Test void persisteFinalizacaoEHistoricoAtomicamente() {
        int antes = dados.historico(7).size();
        dados.mudarEstado(7, "FINALIZADA", 5);
        assertEquals("FINALIZADA", jdbc.queryForObject("SELECT estado FROM solicitacao WHERE id=7", String.class));
        assertNotNull(jdbc.queryForObject("SELECT data_hora_finalizacao FROM solicitacao WHERE id=7", java.sql.Timestamp.class));
        assertEquals(antes + 1, dados.historico(7).size());
        assertThrows(ResponseStatusException.class, () -> dados.mudarEstado(1, "FINALIZADA", 5));
        assertEquals("ABERTA", jdbc.queryForObject("SELECT estado FROM solicitacao WHERE id=1", String.class));
    }
}
