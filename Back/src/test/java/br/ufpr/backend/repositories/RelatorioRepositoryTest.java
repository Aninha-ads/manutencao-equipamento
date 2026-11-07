package br.ufpr.backend.repositories;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.jdbc.core.JdbcTemplate;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest(properties = "spring.jpa.hibernate.ddl-auto=none")
class RelatorioRepositoryTest {
    @Autowired RelatorioRepository repository;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach void preparar() {
        jdbc.execute("SET MODE MySQL");
        jdbc.execute("CREATE TABLE IF NOT EXISTS categoria(id INT PRIMARY KEY, nome VARCHAR(100))");
        jdbc.execute("""
            CREATE TABLE IF NOT EXISTS solicitacao(
                id INT PRIMARY KEY, categoria_id INT, estado VARCHAR(20),
                valor_orcado DECIMAL(10,2), data_hora_pagamento TIMESTAMP)
            """);
        jdbc.execute("CREATE TABLE IF NOT EXISTS historico_solicitacao(id INT PRIMARY KEY, solicitacao_id INT, estado_novo VARCHAR(20))");
        jdbc.update("DELETE FROM historico_solicitacao");
        jdbc.update("DELETE FROM solicitacao");
        jdbc.update("DELETE FROM categoria");
        jdbc.update("INSERT INTO categoria VALUES(1, 'Notebook')");
        jdbc.update("""
            INSERT INTO solicitacao VALUES
            (1,1,'PAGA',100,'2026-10-06 15:20:00'),
            (2,1,'FINALIZADA',200,'2026-10-10 11:25:00'),
            (3,1,'FINALIZADA',300,NULL),
            (4,1,'FINALIZADA',400,'2026-10-11 10:00:00')
            """);
        jdbc.update("""
            INSERT INTO historico_solicitacao VALUES
            (1,1,'PAGA'),(2,2,'PAGA'),(3,2,'PAGA'),
            (4,2,'FINALIZADA'),(5,3,'REJEITADA'),(6,3,'FINALIZADA')
            """);
    }

    @Test void somaPagasEFinalizadasComPagamentoSemDuplicarHistorico() {
        var categorias = repository.buscarReceitasPorCategoria();
        assertEquals(1, categorias.size());
        assertEquals("Notebook", categorias.get(0)[0]);
        assertEquals(0, new BigDecimal("300").compareTo(new BigDecimal(categorias.get(0)[1].toString())));
        var dias = repository.buscarReceitasPorPeriodo(null, null);
        assertEquals(2, dias.size());
        assertEquals("2026-10-10", dias.get(1)[0].toString());
        assertEquals(0, new BigDecimal("200").compareTo(new BigDecimal(dias.get(1)[1].toString())));
    }

    @Test void filtraFinalizadaPelaDataDoPagamento() {
        var dias = repository.buscarReceitasPorPeriodo(LocalDate.of(2026,10,10), LocalDate.of(2026,10,10));
        assertEquals(1, dias.size());
        assertEquals(0, new BigDecimal("200").compareTo(new BigDecimal(dias.get(0)[1].toString())));
        assertTrue(repository.buscarReceitasPorPeriodo(LocalDate.of(2026,11,1), null).isEmpty());
    }
}
