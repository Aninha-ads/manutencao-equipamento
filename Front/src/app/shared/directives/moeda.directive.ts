import {
  Directive,
  HostListener,
  ElementRef,
  forwardRef
} from '@angular/core';
//os, tive que fazer mudanças aqui, o compilador tava reclamando
//que event target podia ser null, então 
// teve q receber o evento inteiro e verificar o target
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';

import { FormatacaoService } from '../../services/formatacao.service';

@Directive({
  selector: '[appMoeda]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoedaDirective),
      multi: true
    }
  ]
})
export class MoedaDirective implements ControlValueAccessor {

  private onChange = (value: number) => {};
  private onTouched = () => {};

  constructor(
    private el: ElementRef,
    private formatacaoService: FormatacaoService
  ) {}

  writeValue(value: number): void {
    this.el.nativeElement.value =
      this.formatacaoService.formatarMoeda(value || 0);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {

    const input = event.target as HTMLInputElement;
    const value = input.value;

    const apenasNumeros = value.replace(/\D/g, '');

    const numero = parseFloat(apenasNumeros) / 100 || 0;

    this.el.nativeElement.value =
      this.formatacaoService.formatarMoeda(numero);

    this.onChange(numero);
    this.onTouched();
  }
}