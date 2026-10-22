import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResgatarServicoComponent } from './resgatar-servico.component';

describe('ResgatarServicoComponent', () => {
  let component: ResgatarServicoComponent;
  let fixture: ComponentFixture<ResgatarServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideHttpClient()],
      imports: [ResgatarServicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResgatarServicoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
