package app.controllers;

import app.services.RelatorioService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {

    private final RelatorioService service;

    public RelatorioController(RelatorioService service) {
        this.service = service;
    }

    @GetMapping("/receitas/pdf")
    public ResponseEntity<byte[]> gerarRelatorioReceitas(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate inicio,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fim
    ) throws IOException {

        if (inicio != null && fim != null && inicio.isAfter(fim)) {
            return ResponseEntity.badRequest().build();
        }

        byte[] pdf = service.gerarRelatorioReceitas(inicio, fim);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=relatorio-receitas.pdf"
                )
                .body(pdf);
    }

    @GetMapping("/receitas/categorias/pdf")
    public ResponseEntity<byte[]> gerarRelatorioCategorias()
            throws IOException {

        byte[] pdf = service.gerarRelatorioCategorias();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=relatorio-categorias.pdf"
                )
                .body(pdf);
    }
}