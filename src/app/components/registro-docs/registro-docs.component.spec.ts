import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDocsComponent } from './registro-docs.component';

describe('RegistroDocsComponent', () => {
  let component: RegistroDocsComponent;
  let fixture: ComponentFixture<RegistroDocsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroDocsComponent]
    });
    fixture = TestBed.createComponent(RegistroDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
