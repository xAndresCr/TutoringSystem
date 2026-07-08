import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioList } from './servicio-list';

describe('ServicioList', () => {
  let component: ServicioList;
  let fixture: ComponentFixture<ServicioList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioList],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
