import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataListExample } from './data-list.example';

describe('DataListExample', () => {
  let component: DataListExample;
  let fixture: ComponentFixture<DataListExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataListExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataListExample);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
