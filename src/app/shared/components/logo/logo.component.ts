import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppSetting } from '@shared/constants/app.constant';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  templateUrl: './logo.component.html',
})
export class LogoComponent {
  AppSetting = AppSetting;
}
