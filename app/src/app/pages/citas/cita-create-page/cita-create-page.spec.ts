import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaCreatePage } from './cita-create-page';

describe('CitaCreatePage', () => {
  let component: CitaCreatePage;
  let fixture: ComponentFixture<CitaCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaCreatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(CitaCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
