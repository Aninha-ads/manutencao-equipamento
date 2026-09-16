import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarFuncionarioComponent } from '../navbar-funcionario/navbar-funcionario.component';

@Component({
  selector: 'app-funcionario-layout',
  imports: [RouterOutlet, NavbarFuncionarioComponent],
  templateUrl: './funcionario-layout.component.html',
  styleUrl: './funcionario-layout.component.css'
})
export class FuncionarioLayoutComponent {}