import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppSetting } from '@shared/constants/app.constant';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';

@Component({
  selector: 'app-home',
  imports: [IconComponent, RouterLink],
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
