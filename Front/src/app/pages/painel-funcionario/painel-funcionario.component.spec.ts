import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelFuncionarioComponent } from './painel-funcionario.component';

describe('PainelFuncionarioComponent', () => {
  let component: PainelFuncionarioComponent;
  let fixture: ComponentFixture<PainelFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelFuncionarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelFuncionarioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
