import { Component } from '@angular/core';
import { AppSetting } from '@shared/constants/app.constant';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
})
export class Footer {
  AppSetting = AppSetting;
  currentYear = new Date().getFullYear();

  constructor() {}
}
