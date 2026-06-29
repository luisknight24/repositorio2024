import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraRepositorioComponent } from './carrera-repositorio.component';

describe('CarreraRepositorioComponent', () => {
  let component: CarreraRepositorioComponent;
  let fixture: ComponentFixture<CarreraRepositorioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarreraRepositorioComponent]
    });
    fixture = TestBed.createComponent(CarreraRepositorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
