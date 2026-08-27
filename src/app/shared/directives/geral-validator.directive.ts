import { Directive, Input } from '@angular/core';
import {
  FormControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from '@angular/forms';

@Directive({
  selector: '[appGeralValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: GeralValidatorDirective,
      multi: true
    }
  ]
})
export class GeralValidatorDirective implements Validator{
  @Input('appGeralValidator') tipo!: string;
  validate(c: FormControl): ValidationErrors | null {
    if(!c.value) {
      return null;
    }
    if(this.tipo === 'cpf') {
      return this.validarCPF(c.value) ? null : { cpfInvalido: true };
    }
    return null;
  }
  private validarCPF(valor: string): boolean {
    const cpf = valor.replace(/\D/g, '');
    if(cpf.length !== 11) {
      return false;
    }
    if(/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }
    let soma=0;
    for (let i = 0; i < 9; i++) {
      soma += Number(cpf.charAt(i)) * (10-1);
    }
    let resto = (soma * 10) % 11;
    if(resto === 10 || resto === 11) {
      resto=0;
    }
    if(resto !== Number(cpf.charAt(9))) {
      return false;
    }
    soma = 0;
    for (let i = 0; i < 10; i++){
      soma += Number(cpf.charAt(i)) * (11-i);
    }
    resto = (soma * 10) % 11;
    if(resto === 10 || resto === 11) {
      resto = 0;
    }
    if(resto !== Number(cpf.charAt(10))) {
      return false;
    }
    return true;
  }
}
