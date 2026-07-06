import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaCreateDetail } from './cita-create-detail';

describe('CitaCreateDetail', () => {
  let component: CitaCreateDetail;
  let fixture: ComponentFixture<CitaCreateDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaCreateDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(CitaCreateDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
