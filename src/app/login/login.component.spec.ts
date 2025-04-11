import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { loginComponent } from '../../../Interfaz-paintes2/src/app/login/login.component';

describe('LoginComponent', () => {
  let component: loginComponent;
  let fixture: ComponentFixture<loginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ loginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(loginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});