package br.ufpr.backend.services;

import br.ufpr.backend.repositories.RelatorioRepository;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RelatorioServiceTest {
    @Test void pdfPorPeriodoExibeDatasAcentosETotal() throws Exception {
        var repository = mock(RelatorioRepository.class);
        var inicio = LocalDate.of(2026,10,1);
        var fim = LocalDate.of(2026,10,31);
        when(repository.buscarReceitasPorPeriodo(inicio, fim)).thenReturn(
            List.<Object[]>of(new Object[]{java.sql.Date.valueOf("2026-10-10"), new BigDecimal("250.50")}));
        byte[] pdf = new RelatorioService(repository).gerarRelatorioReceitas(inicio, fim);
        try (var documento = Loader.loadPDF(pdf)) {
            String texto = new PDFTextStripper().getText(documento);
            assertTrue(texto.contains("RELATÓRIO DE RECEITAS"));
            assertTrue(texto.contains("01/10/2026 até 31/10/2026"));
            assertTrue(texto.contains("10/10/2026"));
            assertTrue(texto.contains("250,50"));
            assertTrue(texto.contains("TOTAL RECEBIDO"));
        }
        Files.createDirectories(Path.of("target", "test-artifacts"));
        Files.write(Path.of("target", "test-artifacts", "relatorio-receitas.pdf"), pdf);
    }

    @Test void categoriasLongasGeramContinuacaoSemPerderTotal() throws Exception {
        var repository = mock(RelatorioRepository.class);
        List<Object[]> resultados = new ArrayList<>();
        for (int i=0; i<60; i++) resultados.add(new Object[]{
            "Categoria de equipamentos com descrição extensa para verificar quebra de linha número " + i, new BigDecimal("10.00")});
        when(repository.buscarReceitasPorCategoria()).thenReturn(resultados);
        byte[] pdf = new RelatorioService(repository).gerarRelatorioCategorias();
        try (var documento = Loader.loadPDF(pdf)) {
            assertTrue(documento.getNumberOfPages() > 1);
            String texto = new PDFTextStripper().getText(documento);
            assertTrue(texto.contains("continuação"));
            assertTrue(texto.contains("600,00"));
        }
        Files.createDirectories(Path.of("target", "test-artifacts"));
        Files.write(Path.of("target", "test-artifacts", "relatorio-categorias.pdf"), pdf);
    }

    @Test void informaQuandoNaoHaReceitas() throws Exception {
        var repository = mock(RelatorioRepository.class);
        when(repository.buscarReceitasPorCategoria()).thenReturn(List.of());
        try (var documento = Loader.loadPDF(new RelatorioService(repository).gerarRelatorioCategorias())) {
            assertTrue(new PDFTextStripper().getText(documento).contains("Nenhuma receita encontrada."));
        }
    }
}
