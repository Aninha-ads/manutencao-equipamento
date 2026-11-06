package app.services;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import app.repositories.RelatorioRepository;

@Service
public class RelatorioService {

    private final RelatorioRepository repository;

    private final NumberFormat formatoMoeda =
            NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));

    private final DateTimeFormatter formatoData =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public RelatorioService(RelatorioRepository repository) {
        this.repository = repository;
    }

    public byte[] gerarRelatorioReceitas(LocalDate inicio, LocalDate fim)
            throws IOException {

        List<Object[]> resultados =
                repository.buscarReceitasPorPeriodo(inicio, fim);

        List<String> linhas = new ArrayList<>();

        linhas.add("Periodo: "
                + (inicio == null ? "Inicio nao informado" : inicio.format(formatoData))
                + " ate "
                + (fim == null ? "Fim nao informado" : fim.format(formatoData)));

        linhas.add("");
        linhas.add("DATA DO PAGAMENTO                 VALOR RECEBIDO");
        linhas.add("--------------------------------------------------");

        BigDecimal totalGeral = BigDecimal.ZERO;

        for (Object[] resultado : resultados) {
            String data = resultado[0].toString();

            BigDecimal valor = converterValor(resultado[1]);
            totalGeral = totalGeral.add(valor);

            LocalDate dataPagamento = LocalDate.parse(data);

            linhas.add(
                    dataPagamento.format(formatoData)
                            + "                         "
                            + formatoMoeda.format(valor)
            );
        }

        linhas.add("");
        linhas.add("--------------------------------------------------");
        linhas.add("TOTAL RECEBIDO: " + formatoMoeda.format(totalGeral));

        if (resultados.isEmpty()) {
            linhas.add("Nenhum pagamento encontrado no periodo.");
        }

        return criarPdf("RELATORIO DE RECEITAS", linhas);
    }

    public byte[] gerarRelatorioCategorias() throws IOException {

        List<Object[]> resultados =
                repository.buscarReceitasPorCategoria();

        List<String> linhas = new ArrayList<>();

        linhas.add("RECEITAS AGRUPADAS POR CATEGORIA");
        linhas.add("");
        linhas.add("CATEGORIA                         VALOR RECEBIDO");
        linhas.add("--------------------------------------------------");

        BigDecimal totalGeral = BigDecimal.ZERO;

        for (Object[] resultado : resultados) {
            String categoria = resultado[0].toString();
            BigDecimal valor = converterValor(resultado[1]);

            totalGeral = totalGeral.add(valor);

            linhas.add(categoria + "                         "
                    + formatoMoeda.format(valor));
        }

        linhas.add("");
        linhas.add("--------------------------------------------------");
        linhas.add("TOTAL RECEBIDO: " + formatoMoeda.format(totalGeral));

        if (resultados.isEmpty()) {
            linhas.add("Nenhuma receita encontrada.");
        }

        return criarPdf("RELATORIO DE RECEITAS POR CATEGORIA", linhas);
    }

    private BigDecimal converterValor(Object valor) {
        if (valor == null) {
            return BigDecimal.ZERO;
        }

        if (valor instanceof BigDecimal) {
            return (BigDecimal) valor;
        }

        return new BigDecimal(valor.toString());
    }

    private byte[] criarPdf(String titulo, List<String> linhas)
            throws IOException {

        try (PDDocument documento = new PDDocument();
             ByteArrayOutputStream saida = new ByteArrayOutputStream()) {

            PDType1Font fonteTitulo =
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

            PDType1Font fonteTexto =
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            PDPage pagina = new PDPage();
            documento.addPage(pagina);

            PDPageContentStream conteudo =
                    new PDPageContentStream(documento, pagina);

            float y = 750;

            conteudo.beginText();
            conteudo.setFont(fonteTitulo, 16);
            conteudo.newLineAtOffset(50, y);
            conteudo.showText(titulo);
            conteudo.endText();

            y -= 40;

            for (String linha : linhas) {
                if (y < 60) {
                    conteudo.close();

                    pagina = new PDPage();
                    documento.addPage(pagina);

                    conteudo = new PDPageContentStream(documento, pagina);
                    y = 750;
                }

                conteudo.beginText();
                conteudo.setFont(fonteTexto, 11);
                conteudo.newLineAtOffset(50, y);
                conteudo.showText(linha);
                conteudo.endText();

                y -= 20;
            }

            conteudo.close();

            documento.save(saida);

            return saida.toByteArray();
        }
    }
}