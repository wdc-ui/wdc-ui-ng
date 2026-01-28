import { Component, inject } from '@angular/core';
import { AppSetting } from '../../../shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { TocService } from 'src/app/core/services/toc.service';

@Component({
  selector: 'app-button-example',
  standalone: true,
  imports: [ButtonComponent, IconComponent, UiConfig],
  templateUrl: './button-example.html',
})
export class ButtonExample {
  private tocService = inject(TocService);
  AppSetting = AppSetting;

  ngOnInit() {
    // Manually define the headings for this page
    this.tocService.setToc([
      { id: 'installation', title: 'Installation', level: 'h2' },
      { id: 'examples', title: 'Examples', level: 'h2' },
      { id: 'references', title: 'API References', level: 'h2' },
    ]);
  }

  references: ReferenceItem[] = [
    {
      input: 'variant',
      type: `'solid' | 'outline' | 'ghost' | 'link'`,
      default: `'solid'`,
      description: 'The visual style of the button.',
    },
    {
      input: 'color',
      type: `'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'`,
      default: `'primary'`,
      description: 'The color theme of the button.',
    },
    {
      input: 'size',
      type: `'default' | 'sm' | 'lg'`,
      default: `'default'`,
      description: 'Controls the height and padding of the button.',
    },
    {
      input: 'icon',
      type: `boolean`,
      default: `false`,
      description: 'If true, sets the button to a square shape for icon-only usage.',
    },
    {
      input: 'rounded',
      type: `'default' | 'full' | 'none'`,
      default: `'default'`,
      description: 'Controls the border radius.',
    },
    {
      input: 'gradient',
      type: `boolean`,
      default: `false`,
      description: 'Applies a gradient background (only works with solid variant).',
    },
    {
      input: 'loading',
      type: `boolean`,
      default: `false`,
      description: 'Shows a spinner and disables the button.',
    },
  ];

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} button`),
    variants: {
      html: dedent(`<div class="flex flex-wrap gap-4">
          <wdc-button color="primary">Primary</wdc-button>
          <wdc-button color="secondary">Secondary</wdc-button>
          <wdc-button color="success">Success</wdc-button>
          <wdc-button color="danger">Danger</wdc-button>
          <wdc-button color="warning">Warning</wdc-button>
          <wdc-button color="info">Info</wdc-button>
          <wdc-button color="light">Light</wdc-button>
          <wdc-button color="dark">Dark</wdc-button>
        </div>`),
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
      html: dedent(`<div class="flex flex-wrap items-center gap-4">
          <wdc-button size="sm">Small</wdc-button>
          <wdc-button size="default">Default</wdc-button>
          <wdc-button size="lg">Large</wdc-button>
        </div>`),
    },
    icons: {
      html: dedent(`
        <div preview class="flex flex-wrap gap-4 items-center justify-center">
          <wdc-button size="sm" icon>
            <wdc-icon name="add"></wdc-icon>
          </wdc-button>
          <wdc-button size="default" icon>
            <wdc-icon name="add"></wdc-icon>
          </wdc-button>
          <wdc-button size="lg" icon>
            <wdc-icon name="add"></wdc-icon>
          </wdc-button>
        </div>`),
      ts: ``,
    },
  };
}
