import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PainelCliente, PainelClienteComponent } from './painel-cliente.component';

describe('PainelClienteComponent', () => {
  let component: PainelClienteComponent;
  let fixture: ComponentFixture<PainelClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelClienteComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});