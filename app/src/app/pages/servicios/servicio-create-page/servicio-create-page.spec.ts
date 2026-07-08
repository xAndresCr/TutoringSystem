import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioCreatePage } from './servicio-create-page';

describe('ServicioCreatePage', () => {
  let component: ServicioCreatePage;
  let fixture: ComponentFixture<ServicioCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioCreatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
