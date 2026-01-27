import { Component, input, output } from '@angular/core';
import { DIALOG_COMPONENTS } from './dialog.component';
import { ButtonComponent } from '../button/button.component'; // Ensure correct path

@Component({
  selector: 'wdc-confirm-dialog',
  standalone: true,
  imports: [DIALOG_COMPONENTS, ButtonComponent],
  template: `
    <wdc-dialog [open]="open()" (openChange)="openChange.emit($event)" size="sm">
      <wdc-dialog-header>
        <wdc-dialog-title>{{ title() }}</wdc-dialog-title>
        <wdc-dialog-description>
          {{ description() }}
        </wdc-dialog-description>
      </wdc-dialog-header>

      <wdc-dialog-footer>
        <wdc-button variant="outline" (click)="onCancel()">
          {{ cancelText() }}
        </wdc-button>

        <wdc-button
          [variant]="variant() === 'danger' ? 'solid' : 'solid'"
          [color]="variant() === 'danger' ? 'danger' : 'primary'"
          (click)="onConfirm()"
        >
          {{ confirmText() }}
        </wdc-button>
      </wdc-dialog-footer>
    </wdc-dialog>
  `,
})
export class ConfirmDialogComponent {
  open = input<boolean>(false);
  title = input.required<string>();
  description = input<string>('Are you sure you want to proceed?');

  confirmText = input<string>('Confirm');
  cancelText = input<string>('Cancel');

  variant = input<'danger' | 'info'>('danger');

  openChange = output<boolean>();
  confirm = output<void>();
  cancel = output<void>();

  onConfirm() {
    this.confirm.emit();
    this.openChange.emit(false);
  }

  onCancel() {
    this.cancel.emit();
    this.openChange.emit(false);
  }
}
