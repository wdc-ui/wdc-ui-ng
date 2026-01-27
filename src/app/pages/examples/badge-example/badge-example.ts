import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@wdc-ui/ng/badge/badge.component';
import { UiConfig, ReferenceItem } from '../../../shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';

@Component({
  selector: 'app-badge-example',
  standalone: true,
  imports: [CommonModule, BadgeComponent, UiConfig, ButtonComponent, IconComponent],
  templateUrl: './badge-example.html',
})
export class BadgeExample {
  AppSetting = AppSetting;

  references: ReferenceItem[] = [
    {
      input: 'value',
      type: 'string | number',
      default: '-',
      description: 'Value to display (optional, can use content projection).',
    },
    {
      input: 'variant',
      type: `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'`,
      default: `'primary'`,
      description: 'Visual style variant.',
    },
    {
      input: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Size of the badge.',
    },
    {
      input: 'rounded',
      type: 'boolean',
      default: 'false',
      description: 'Whether to use fully rounded corners (pill shape).',
    },
  ];

  snippets = {
    html: dedent(`<div class="flex gap-4 items-center">
          <wdc-badge>Primary</wdc-badge>
          <wdc-badge variant="secondary">Secondary</wdc-badge>
          <wdc-badge variant="success">Success</wdc-badge>
          <wdc-badge variant="danger">Danger</wdc-badge>
          <wdc-badge variant="warning">Warning</wdc-badge>
          <wdc-badge variant="info">Info</wdc-badge>
      </div>

      <div class="flex gap-4 items-center mt-4">
          <wdc-badge size="sm">Small</wdc-badge>
          <wdc-badge size="md">Medium</wdc-badge>
          <wdc-badge size="lg">Large</wdc-badge>
      </div>

      <div class="flex gap-4 items-center mt-4">
          <wdc-badge [rounded]="true">Rounded</wdc-badge>
          <wdc-badge variant="success" [rounded]="true" size="sm">Small</wdc-badge>
      </div>`),
    ts: dedent(`import { Component } from '@angular/core';
      import { BadgeComponent } from '${AppSetting.libName}';
      @Component({
          selector: 'app-example',
          standalone: true,
          imports: [BadgeComponent],
      })
      export class ExampleComponent {}`),
  };
}
