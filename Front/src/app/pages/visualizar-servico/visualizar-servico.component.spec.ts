import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarServicoComponent } from './visualizar-servico.component';

describe('VisualizarServicoComponent', () => {
  let component: VisualizarServicoComponent;
  let fixture: ComponentFixture<VisualizarServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarServicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizarServicoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
