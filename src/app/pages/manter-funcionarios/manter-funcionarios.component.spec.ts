import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterFuncionariosComponent } from './manter-funcionarios.component';

describe('ManterFuncionariosComponent', () => {
  let component: ManterFuncionariosComponent;
  let fixture: ComponentFixture<ManterFuncionariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManterFuncionariosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManterFuncionariosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
