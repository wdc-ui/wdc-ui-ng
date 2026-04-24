import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@wdc-ui/ng/badge/badge.component';
import { UiConfig, ReferenceItem } from '../../../shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { TocService } from 'src/app/core/services/toc.service';
import { ALERT_COMPONENTS } from '@wdc-ui/ng/alert/alert.component';

@Component({
  selector: 'app-alert-example',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    UiConfig,
    ButtonComponent,
    IconComponent,
    ALERT_COMPONENTS,
  ],
  templateUrl: './alert-example.html',
})
export class AlertExample {
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
      type: "'default' | 'danger' | 'success' | 'warning' | 'info'",
      default: "'default'",
      description: 'The visual style and color intent of the alert.',
    },
    {
      input: 'icon',
      type: 'string',
      default: 'null',
      description: 'Name of the icon to display on the left side (uses wdc-icon).',
    },
  ];

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} alert`),
    basic: {
      html: dedent(`<wdc-alert icon="terminal">
        <wdc-alert-title>Heads up!</wdc-alert-title>
        <wdc-alert-description>
          You can add components to your app using the cli.
        </wdc-alert-description>
      </wdc-alert>`),
      ts: dedent(`import { ALERT_COMPONENTS } from '@wdc-ui/components`),
    },
    variants: {
      html: dedent(`
      <div class="flex flex-col gap-4 w-full">
        <wdc-alert variant="danger" icon="error">
          <wdc-alert-title>Error</wdc-alert-title>
          <wdc-alert-description>
            Your session has expired. Please log in again.
          </wdc-alert-description>
        </wdc-alert>

        <wdc-alert variant="success" icon="check_circle">
          <wdc-alert-title>Payment Successful</wdc-alert-title>
          <wdc-alert-description>
            Your order #12345 has been processed successfully.
          </wdc-alert-description>
        </wdc-alert>

        <wdc-alert variant="warning" icon="warning">
          <wdc-alert-title>Storage Almost Full</wdc-alert-title>
          <wdc-alert-description>
            You have used 95% of your storage quota. Delete old files to free up space.
          </wdc-alert-description>
        </wdc-alert>
      </div>
    `),
      ts: ``,
    },
  };
}
