import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioEditPage } from './servicio-edit-page';

describe('ServicioEditPage', () => {
  let component: ServicioEditPage;
  let fixture: ComponentFixture<ServicioEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioEditPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
