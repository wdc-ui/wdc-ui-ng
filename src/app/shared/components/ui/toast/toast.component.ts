import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { Toast } from './toast.service';

// Colors Variant
const toastVariants = cva(
  'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all',
  {
    variants: {
      variant: {
        light: 'border bg-background text-foreground',
        dark: 'border bg-slate-950 text-white',
        success: 'border-success bg-success text-success-foreground',
        error: 'border-danger bg-danger text-danger-foreground',
        warning: 'border-warning bg-warning text-warning-foreground',
        info: 'border-info bg-info text-info-foreground',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  },
);

@Component({
  selector: 'wdc-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClass()">
      <div class="grid gap-1">
        <div class="text-sm font-semibold pr-6">
          {{ toast().message }}
        </div>
        @if (toast().description) {
          <div class="text-xs opacity-90">
            {{ toast().description }}
          </div>
        }
      </div>

      <button
        (click)="close.emit()"
        class="absolute right-2 top-2 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `,
})
export class ToastComponent {
  toast = input.required<Toast>();
  close = output<void>();

  computedClass = computed(() => {
    const t = this.toast();

    // 1. Calculate Animation Class based on Position
    let animationClass = '';

    if (t.closing) {
      animationClass = 'animate-toast-out';
    } else {
      switch (t.position) {
        case 'top-left':
        case 'bottom-left':
          animationClass = 'animate-toast-in-left';
          break;
        case 'top-right':
        case 'bottom-right':
          animationClass = 'animate-toast-in-right';
          break;
        case 'top-center':
          animationClass = 'animate-toast-in-top';
          break;
        case 'bottom-center':
          animationClass = 'animate-toast-in-bottom';
          break;
      }
    }

    // 2. Merge CVA, Animation, and custom logic
    return cn(toastVariants({ variant: t.type }), animationClass);
  });
}
