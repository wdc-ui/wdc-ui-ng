import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastPosition } from './toast.service';
import { ToastComponent } from './toast.component';

@Component({
  selector: 'wdc-toaster',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    @for (pos of positions; track pos) {
      <div
        [class]="getPositionClass(pos)"
        class="fixed z-[100] flex max-h-screen w-full p-4 gap-2 sm:max-w-[420px] pointer-events-none"
      >
        @for (toast of getToastsByPosition(pos); track toast.id) {
          <wdc-toast [toast]="toast" (close)="toastService.startRemove(toast.id)" />
        }
      </div>
    }
  `,
})
export class ToasterComponent {
  toastService = inject(ToastService);

  positions: ToastPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

  getToastsByPosition(pos: ToastPosition) {
    return this.toastService.toasts().filter((t) => t.position === pos);
  }

  getPositionClass(pos: ToastPosition): string {
    // Flex-col vs Flex-col-reverse logic for stacking
    // Top positions: Newest on Top (flex-col-reverse)
    // Bottom positions: Newest on Bottom (flex-col) - wait, standard is usually stack up from bottom

    const base = 'flex-col'; // New items append at end

    switch (pos) {
      case 'top-left':
        return `top-0 left-0 ${base}`;
      case 'top-center':
        return `top-0 left-1/2 -translate-x-1/2 ${base}`;
      case 'top-right':
        return `top-0 right-0 ${base}`;

      // Bottom positions should stack upwards? usually flex-col works if we append new items.
      case 'bottom-left':
        return `bottom-0 left-0 ${base}`;
      case 'bottom-center':
        return `bottom-0 left-1/2 -translate-x-1/2 ${base}`;
      case 'bottom-right':
        return `bottom-0 right-0 ${base}`;
      default:
        return 'bottom-0 right-0';
    }
  }
}

export const TOAST_COMPONENTS = [ToasterComponent, ToastComponent] as const;
