import { Component } from '@angular/core';
import { AppSetting } from '@shared/constants/app.constant';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { dedent } from '@shared/utils/dedent';
import { BREADCRUMB_COMPONENTS, BreadcrumbItem } from '@wdc-ui/ng/breadcrumb/breadcrumb.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';

@Component({
  selector: 'wdc-breadcrumb-example',
  imports: [UiConfig, BREADCRUMB_COMPONENTS, IconComponent],
  templateUrl: './breadcrumb-example.html',
})
export class BreadcrumbExample {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Settings', url: '/dashboard/settings' },
    { label: 'Profile' }, // No URL = Active Page
  ];

  references: ReferenceItem[] = [
    {
      input: 'open',
      type: 'boolean',
      default: 'false',
      description: 'Whether the accordion item is open or not.',
    },
    {
      input: 'noPaddingBody',
      type: 'boolean',
      default: 'false',
      description: 'Whether to remove padding from the accordion body.',
    },
    {
      input: 'customActions',
      type: 'boolean',
      default: 'false',
      description: 'Whether to display custom actions in the accordion header.',
    },
  ];

  snippets = {
    html: dedent(`<wdc-breadcrumb [items]="breadcrumbs"></wdc-breadcrumb>
      <wdc-breadcrumb class="mt-5">
        <wdc-breadcrumb-item url="/">
          <wdc-icon name="home" size="14" />
        </wdc-breadcrumb-item>
        <wdc-breadcrumb-separator />
        <wdc-breadcrumb-item url="/products">Products</wdc-breadcrumb-item>
        <wdc-breadcrumb-separator />
        <wdc-breadcrumb-item url="/products/electronics">Electronics</wdc-breadcrumb-item>
        <wdc-breadcrumb-separator>
          <span class="opacity-50">/</span>
        </wdc-breadcrumb-separator>
        <wdc-breadcrumb-item>Iphone 15 Pro</wdc-breadcrumb-item>
      </wdc-breadcrumb>`),
    ts: dedent(`import { Component } from '@angular/core';
      import {
        BREADCRUMB_COMPONENTS,
        BreadcrumbItem,
      } from '${AppSetting.libName}/breadcrumb/breadcrumb.component';
      import { IconComponent } from '${AppSetting.libName}/icon/icon.component';
      @Component({
          selector: 'app-example',
          standalone: true,
          imports: [BREADCRUMB_COMPONENTS, IconComponent],
      })
      export class ExampleComponent {
        breadcrumbs: BreadcrumbItem[] = [
          { label: 'Home', url: '/' },
          { label: 'Dashboard', url: '/dashboard' },
          { label: 'Settings', url: '/dashboard/settings' },
          { label: 'Profile' }, // No URL = Active Page
        ];
      }`),
  };
}
