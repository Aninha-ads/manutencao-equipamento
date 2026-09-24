import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
//seguindo o slide(279) do professor
//decidi tirar o NavbarComponent pois ele não vai ser mais utilizado
/*import { NavbarComponent } from './pages/navbar/navbar.component';*/
import { FooterComponent } from './pages/footer/footer.component';
import { ClienteService } from './services/cliente.service';
import { Cliente } from './models/cliente.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('manutencao-equipamento');

  private clienteService = inject(ClienteService);

  constructor(public router: Router) {}

  ngOnInit() {
    this.clienteService.listarTodos().subscribe({
      next: (data: Cliente[]) => console.log(data)
    });
  }
}