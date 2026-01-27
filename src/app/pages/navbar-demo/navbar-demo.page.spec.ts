import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDemoPage } from './navbar-demo.page';

describe('NavbarDemoPage', () => {
  let component: NavbarDemoPage;
  let fixture: ComponentFixture<NavbarDemoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarDemoPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarDemoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
