import { Pipe, PipeTransform } from '@angular/core';
import { FormatacaoService } from '../services/formatacao.service';

@Pipe({
  name: 'dataBr',
  standalone: true
})
export class DataBrPipe implements PipeTransform {
  constructor(private formatacaoService: FormatacaoService) {}

  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    return this.formatacaoService.formatarDataBr(value);
  }
}