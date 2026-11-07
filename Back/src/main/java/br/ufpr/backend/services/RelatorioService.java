package br.ufpr.backend.services;

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

import br.ufpr.backend.repositories.RelatorioRepository;

@Service
public class RelatorioService {

    private final RelatorioRepository repository;

    private final DateTimeFormatter formatoData =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public RelatorioService(RelatorioRepository repository) {
        this.repository = repository;
    }

    public byte[] gerarRelatorioReceitas(LocalDate inicio, LocalDate fim)
            throws IOException {

        NumberFormat formatoMoeda = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("pt-BR"));

        List<Object[]> resultados =
                repository.buscarReceitasPorPeriodo(inicio, fim);

        List<String> linhas = new ArrayList<>();

        linhas.add("Período: "
                + (inicio == null ? "Início não informado" : inicio.format(formatoData))
                + " até "
                + (fim == null ? "Fim não informado" : fim.format(formatoData)));
        linhas.add("Inclui pedidos pagos e finalizados com pagamento registrado.");

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
            linhas.add("Nenhum pagamento encontrado no período.");
        }

        return criarPdf("RELATÓRIO DE RECEITAS", linhas);
    }

    public byte[] gerarRelatorioCategorias() throws IOException {

        NumberFormat formatoMoeda = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("pt-BR"));

        List<Object[]> resultados =
                repository.buscarReceitasPorCategoria();

        List<String> linhas = new ArrayList<>();

        linhas.add("RECEITAS AGRUPADAS POR CATEGORIA");
        linhas.add("Inclui pedidos pagos e finalizados com pagamento registrado.");
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

        return criarPdf("RELATÓRIO DE RECEITAS POR CATEGORIA", linhas);
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
            conteudo.setFont(fonteTitulo, 13);
            conteudo.newLineAtOffset(50, y);
            conteudo.showText(titulo);
            conteudo.endText();

            y -= 40;

            List<String> linhasAjustadas = new ArrayList<>();
            for (String linha : linhas) {
                linhasAjustadas.addAll(quebrarLinha(linha, fonteTexto, 11, pagina.getMediaBox().getWidth() - 100));
            }
            for (String linha : linhasAjustadas) {
                if (y < 60) {
                    conteudo.close();

                    pagina = new PDPage();
                    documento.addPage(pagina);

                    conteudo = new PDPageContentStream(documento, pagina);
                    y = 750;
                    conteudo.beginText();
                    conteudo.setFont(fonteTitulo, 13);
                    conteudo.newLineAtOffset(50, y);
                    conteudo.showText(titulo + " (continuação)");
                    conteudo.endText();
                    y -= 40;
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

    private List<String> quebrarLinha(String texto, PDType1Font fonte, float tamanho, float largura) throws IOException {
        List<String> linhas = new ArrayList<>();
        // Os dados podem conter quebras de linha; cada trecho precisa caber nas margens.
        for (String trecho : texto.replace('\t', ' ').split("\\R", -1)) {
            if (trecho.isEmpty()) {
                linhas.add("");
                continue;
            }
            StringBuilder linha = new StringBuilder();
            for (int ponto : trecho.codePoints().toArray()) {
                String caractere = new String(Character.toChars(ponto));
                try {
                    fonte.encode(caractere);
                } catch (IllegalArgumentException e) {
                    caractere = "?";
                }
                String candidata = linha.toString() + caractere;
                if (fonte.getStringWidth(candidata) / 1000 * tamanho > largura && !linha.isEmpty()) {
                    linhas.add(linha.toString());
                    linha.setLength(0);
                }
                linha.append(caractere);
            }
            if (!linha.isEmpty()) linhas.add(linha.toString());
        }
        return linhas;
    }
}
