import { Component } from '@angular/core';
import { AppSetting } from '@shared/constants/app.constant';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-footer',
  imports: [LogoComponent],
  templateUrl: './footer.html',
})
export class Footer {
  AppSetting = AppSetting;
  currentYear = new Date().getFullYear();

  constructor() {}
}
