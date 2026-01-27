import { Component } from '@angular/core';
import { AppSetting } from '../../../shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';

@Component({
  selector: 'app-button-example',
  standalone: true,
  imports: [ButtonComponent, IconComponent, UiConfig],
  templateUrl: './button-example.html',
})
export class ButtonExample {
  AppSetting = AppSetting;

  references: ReferenceItem[] = [
    {
      input: 'variant',
      type: `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'`,
      default: `'primary'`,
      description: 'Variant of the button.',
    },
    {
      input: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Size of the button.',
    },
    {
      input: 'block',
      type: 'boolean',
      default: 'false',
      description: 'Whether the button should take the full width of its container.',
    },
    {
      input: 'outline',
      type: 'boolean',
      default: 'false',
      description: 'Whether the button should have an outline style.',
    },
    {
      input: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Whether the button should show a loading indicator.',
    },
    {
      input: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether the button should be disabled.',
    },
    {
      input: 'clicked',
      type: 'void',
      default: 'undefined',
      description: 'Callback function to be called when the button is clicked.',
    },
  ];

  snippets = {
    variants: {
      html: dedent(`<wdc-button color="primary">Primary</wdc-button>
        <wdc-button color="secondary">Secondary</wdc-button>
        <wdc-button color="success">Success</wdc-button>
        <wdc-button color="danger">Danger</wdc-button>
        <wdc-button color="warning">Warning</wdc-button>
        <wdc-button color="info">Info</wdc-button>
        <wdc-button color="light">Light</wdc-button>
        <wdc-button color="dark">Dark</wdc-button>`),
      ts: dedent(`import { ButtonComponent } from '${AppSetting.importPath}/button/button.component';
        @Component({  
          imports: [ButtonComponent],
          // ...
        })
        export class Example {}`),
    },
    outline: {
      html: dedent(`<wdc-button variant="outline" color="primary">Primary</wdc-button>
        <wdc-button variant="outline" color="secondary">Secondary</wdc-button>
        <wdc-button variant="outline" color="success">Success</wdc-button>
        <wdc-button variant="outline" color="danger">Danger</wdc-button>
        <wdc-button variant="outline" color="warning">Warning</wdc-button>
        <wdc-button variant="outline" color="info">Info</wdc-button>
        <wdc-button variant="outline" color="light">Light</wdc-button>
        <wdc-button variant="outline" color="dark">Dark</wdc-button>`),
    },
    gradient: {
      html: dedent(`<wdc-button [gradient]="true" color="primary">Gradient Blue</wdc-button>
        <wdc-button [gradient]="true" color="secondary">Gradient Purple</wdc-button>
        <wdc-button [gradient]="true" color="success">Gradient Green</wdc-button>
        <wdc-button [gradient]="true" color="primary" rounded="full">Gradient Blue</wdc-button>
        <wdc-button [gradient]="true" size="icon" color="danger" rounded="full">
          <wdc-icons name="favorite" size="16"></wdc-icons>
        </wdc-button>`),
    },
    properties: {
      html: dedent(`<wdc-button rounded="full">Rounded Pill</wdc-button>
        <wdc-button rounded="full" variant="outline">Rounded Outline</wdc-button>
        <wdc-button size="icon">
          <wdc-icons name="favorite" size="16"></wdc-icons>
        </wdc-button>
        <wdc-button size="icon" color="danger" variant="outline" rounded="full">
          <wdc-icons name="delete" size="16"></wdc-icons>
        </wdc-button>
        <wdc-button>
          <wdc-icons name="add"></wdc-icons>
          Add New
        </wdc-button>
        <wdc-button [loading]="true">Loading</wdc-button>
        <wdc-button [disabled]="true">Disabled</wdc-button>
        <wdc-button variant="link" color="success">Link</wdc-button>`),
    },
    sizes: {
      html: dedent(`<wdc-button size="sm">Small</wdc-button>
        <wdc-button size="default">Default</wdc-button>
        <wdc-button size="lg">Large</wdc-button>`),
    },
  };
}
