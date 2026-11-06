import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DadosService } from '../../core/services/dados.service';


@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.css'
})
export class RelatoriosComponent {

  constructor(private dadosService: DadosService) {}

  dataInicial: string = '';
  dataFinal: string = '';

  // Faz o download do PDF
  baixarPdf(pdf: Blob, nomeArquivo: string): void {
    const url = window.URL.createObjectURL(pdf);

    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  }

  // Relatório de receitas
  async gerarRelatorioReceitas(): Promise<void> {
    try {
      const pdf = await this.dadosService.gerarPdfReceitas(
        this.dataInicial || undefined,
        this.dataFinal || undefined
      );

      this.baixarPdf(pdf, 'relatorio-receitas.pdf');

    } catch (erro) {
      console.error('Erro ao gerar relatório de receitas:', erro);
      alert('Não foi possível gerar o relatório de receitas.');
    }
  }

  // Relatório por categoria
  async gerarRelatorioCategorias(): Promise<void> {
    try {
      const pdf = await this.dadosService.gerarPdfCategorias();

      this.baixarPdf(pdf, 'relatorio-categorias.pdf');

    } catch (erro) {
      console.error('Erro ao gerar relatório por categoria:', erro);
      alert('Não foi possível gerar o relatório por categoria.');
    }
  }
}