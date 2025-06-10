import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciamentoPage } from './gerenciamento.page';

describe('GerenciamentoPage', () => {
  let component: GerenciamentoPage;
  let fixture: ComponentFixture<GerenciamentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
