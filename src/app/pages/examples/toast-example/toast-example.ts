import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterComponent } from '@wdc-ui/ng/toast/toaster.component';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { ToastService } from '@wdc-ui/ng/toast/toast.service';
import { dedent } from '@shared/utils/dedent';
import { AppSetting } from '@shared/constants/app.constant';

@Component({
  selector: 'app-toast-example',
  standalone: true,
  imports: [CommonModule, ButtonComponent, UiConfig],
  templateUrl: './toast-example.html',
})
export class ToastExample {
  toastService = inject(ToastService);

  showSuccess() {
    this.toastService.show('Project saved!', {
      type: 'success',
      description: 'Your changes have been saved successfully.',
      position: 'bottom-right',
    });
  }

  showError() {
    this.toastService.show('Connection Failed', {
      type: 'error',
      position: 'top-center',
    });
  }

  showWarning() {
    this.toastService.show('Connection Failed', {
      type: 'warning',
      position: 'top-right',
    });
  }

  showInfo() {
    this.toastService.show('New Update', {
      type: 'info',
      description: 'Version 2.0 is available',
      position: 'top-left',
    });
  }

  showDark() {
    this.toastService.show('Dark Toast', {
      type: 'dark',
      position: 'bottom-left',
    });
  }

  references: ReferenceItem[] = [
    {
      input: 'type',
      type: `'success' | 'error' | 'warning' | 'info'`,
      default: `'info'`,
      description: 'Type of the toast.',
    },
    {
      input: 'duration',
      type: 'number',
      default: '3000',
      description: 'Duration of the toast in milliseconds.',
    },
    {
      input: 'position',
      type: `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'`,
      default: `'top-right'`,
      description: 'Position of the toast.',
    },
    {
      input: 'message',
      type: 'string',
      default: 'undefined',
      description: 'Message to display in the toast.',
    },
  ];

  snippets = {
    html: dedent(`<wdc-button (click)="showSuccess()" variant="success">Success</wdc-button>
          <wdc-button (click)="showError()" variant="danger">Error</wdc-button>
          <wdc-button (click)="showWarning()" variant="warning">Warning</wdc-button>
          <wdc-button (click)="showInfo()" variant="info">Info</wdc-button>`),
    ts: dedent(`
          import { Component } from '@angular/core';
          import { ToastComponent } from '${AppSetting.libName}';
          @Component({
              selector: 'app-example',
              standalone: true,
              imports: [ToastComponent],
          })
          export class ExampleComponent {
            constructor(private toastService: ToastService) {}
            
            showSuccess() {
              this.toastService.success('Operation successful!');
            }

            showError() {
              this.toastService.error('Something went wrong.');
            }

            showWarning() {
              this.toastService.warning('Please be careful.');
            }

            showInfo() {
              this.toastService.info('Here is some information.');
            }
          }`),
  };
}
