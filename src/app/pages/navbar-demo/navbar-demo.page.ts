import { Component } from '@angular/core';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { NAVBAR_COMPONENTS } from '@wdc-ui/ng/navbar/navbar.component';

@Component({
  selector: 'wdc-navbar-demo',
  imports: [NAVBAR_COMPONENTS, ButtonComponent, IconComponent],
  templateUrl: './navbar-demo.page.html',
  styleUrl: './navbar-demo.page.css',
})
export class NavbarDemoPage {}
