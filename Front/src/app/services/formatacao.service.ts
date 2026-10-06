import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatacaoService {
  formatarDataBr(data: string | Date): string {
    if (!data) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(data));
  }

  formatarDataHoraBr(data: string | Date): string {
    if (!data) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(new Date(data));
  }

  formatarMoeda(valor: number): string {
    if (typeof valor !== 'number') return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  converterMoeda(valorFormatado: string): number {
    if (!valorFormatado) return 0;
    const textoLimpo = valorFormatado.replace(/[^\d,-]/g, '').replace(',', '.');
    return parseFloat(textoLimpo) || 0;
  }
}