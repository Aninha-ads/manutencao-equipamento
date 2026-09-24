import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.css'
})
export class RelatoriosComponent {

  dataInicial: string = '';
  dataFinal: string = '';

  gerarRelatorioReceitas(): void {
    console.log('Relatório de Receitas');
    console.log('Data inicial:', this.dataInicial);
    console.log('Data final:', this.dataFinal);

    // Futuramente:
    // chamar o endpoint do Spring Boot para gerar o PDF
    // por enquanto tem apenas o aviso mesmo, não teve muito
    // tempo essa semana

    alert('Relatório de Receitas por data solicitado!');
  }

  gerarRelatorioCategorias(): void {
    console.log('Relatório de Receitas por Categoria');

      // chamar o endpoint do Spring Boot para gerar o PDF também

    alert('Relatório de Receitas por Categoria solicitado!');
  }
}