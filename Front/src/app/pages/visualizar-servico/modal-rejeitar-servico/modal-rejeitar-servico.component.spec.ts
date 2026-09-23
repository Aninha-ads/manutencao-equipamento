import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRejeitarServicoComponent } from './modal-rejeitar-servico.component';

describe('ModalRejeitarServicoComponent', () => {
  let component: ModalRejeitarServicoComponent;
  let fixture: ComponentFixture<ModalRejeitarServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRejeitarServicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRejeitarServicoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
