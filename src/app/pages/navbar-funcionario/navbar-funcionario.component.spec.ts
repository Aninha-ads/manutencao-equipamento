import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarFuncionarioComponent } from './navbar-funcionario.component';

describe('NavbarFuncionarioComponent', () => {
  let component: NavbarFuncionarioComponent;
  let fixture: ComponentFixture<NavbarFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarFuncionarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarFuncionarioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
