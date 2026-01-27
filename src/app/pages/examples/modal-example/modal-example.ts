import { Component, signal } from '@angular/core';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { ConfirmDialogComponent } from '@wdc-ui/ng/dialog/confirm-dialog.component';
import { DIALOG_COMPONENTS } from '@wdc-ui/ng/dialog/dialog.component';

@Component({
  selector: 'app-modal-example',
  imports: [UiConfig, DIALOG_COMPONENTS, ConfirmDialogComponent, ButtonComponent],
  templateUrl: './modal-example.html',
})
export class ModalExample {
  isBasicOpen = false;
  isLargeOpen = false;

  isProfileOpen = signal(false);
  isDeleteOpen = signal(false);

  saveProfile() {
    console.log('Saved');
    this.isProfileOpen.set(false);
  }

  deleteAccount() {
    console.log('Account Deleted!');
    // Confirm Dialog auto-closes itself in the component logic
  }

  references: ReferenceItem[] = [
    {
      input: 'size',
      type: `'sm' | 'md' | 'lg' | 'xl' | 'full'`,
      default: `'md'`,
      description: 'Size of the modal.',
    },
    {
      input: 'isOpen',
      type: 'boolean',
      default: 'false',
      description: 'Whether the modal is open or not.',
    },
    {
      input: 'closeOnBackdropClick',
      type: 'boolean',
      default: 'true',
      description: 'Whether to close the modal when clicking on the backdrop.',
    },
    {
      input: 'onClose',
      type: 'void',
      default: 'undefined',
      description: 'Callback function to be called when the modal is closed.',
    },
  ];

  snippets = {
    html: dedent(`<wdc-button (click)="openBasic()">Basic Modal</wdc-button>
          <wdc-button (click)="openLarge()" variant="secondary">Large Modal</wdc-button>
          
          <wdc-modal [isOpen]="isBasicOpen" (isOpenChange)="isBasicOpen = $event" title="Basic Modal">
            <p class="text-slate-600 dark:text-slate-400">
              This is a basic modal dialog. It has a title and some content.
            </p>
            <div class="mt-5 sm:mt-6 flex justify-end gap-3">
              <wdc-button (click)="isBasicOpen = false" variant="light">Cancel</wdc-button>
              <wdc-button (click)="isBasicOpen = false">Confirm</wdc-button>
            </div>
          </wdc-modal>
          `),
    ts: dedent(`
        import { Component } from '@angular/core';
        import { ButtonComponent, ModalComponent } from '${AppSetting.libName}';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [ButtonComponent, ModalComponent],
        })
        export class ExampleComponent {
          isBasicOpen = false;
          isLargeOpen = false;
          openBasic() {
            this.isBasicOpen = true;
          }
          openLarge() {
            this.isLargeOpen = true;
          }
        }`),
  };
  openBasic() {
    this.isBasicOpen = true;
  }

  openLarge() {
    this.isLargeOpen = true;
  }
}
