import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppSetting } from '@shared/constants/app.constant';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';

@Component({
  selector: 'app-home',
  imports: [IconComponent, RouterLink, ButtonComponent],
  templateUrl: './home.page.html',
})
export class HomePage {
  installCommand = AppSetting.installCommand;
  copied = signal(false);
  copyCommand() {
    navigator.clipboard.writeText(this.installCommand);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
