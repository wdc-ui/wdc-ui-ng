import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { AppSetting } from '@shared/constants/app.constant';
import { ThemeService } from '@wdc-ui/ng/theme-toggle/theme.service';
import { ThemeToggleComponent } from '@wdc-ui/ng/theme-toggle/theme-toggle.component';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, LogoComponent, ThemeToggleComponent, ButtonComponent],
  templateUrl: './navbar.html',
})
export class Navbar {
  AppSetting = AppSetting;
  private themeService = inject(ThemeService);
}
