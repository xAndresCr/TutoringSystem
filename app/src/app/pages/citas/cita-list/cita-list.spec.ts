import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaList } from './cita-list';

describe('CitaList', () => {
  let component: CitaList;
  let fixture: ComponentFixture<CitaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaList],
    }).compileComponents();

    fixture = TestBed.createComponent(CitaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
