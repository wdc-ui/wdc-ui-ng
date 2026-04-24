import { Component, input, computed } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../icon/icon.component';

// --- STYLES ---
const alertVariants = cva('relative w-full rounded-lg border p-4 flex gap-3 items-start', {
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      danger: 'border-danger/50 text-white dark:border-danger bg-danger',
      success: 'border-success/50 text-white dark:border-success bg-success',
      warning: 'border-warning/50 text-white dark:border-warning bg-warning',
      info: 'border-info/50 text-info dark:border-info bg-info/5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type AlertProps = VariantProps<typeof alertVariants>;

// --- 1. MAIN ALERT CONTAINER ---
@Component({
  selector: 'wdc-alert',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div [class]="computedClass()" role="alert">
      @if (icon()) {
        <wdc-icon [name]="icon()" size="18" class="translate-y-[-1px] shrink-0" />
      }

      <div class="flex-1 space-y-1">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class AlertComponent {
  variant = input<AlertProps['variant']>('default');
  icon = input<string>('');
  class = input<string>('');

  computedClass = computed(() => cn(alertVariants({ variant: this.variant() }), this.class()));
}

// --- 2. ALERT TITLE ---
@Component({
  selector: 'wdc-alert-title',
  standalone: true,
  template: `<h5 [class]="computedClass()"><ng-content></ng-content></h5>`,
})
export class AlertTitleComponent {
  class = input<string>('');
  computedClass = computed(() => cn('font-medium leading-none tracking-tight', this.class()));
}

// --- 3. ALERT DESCRIPTION ---
@Component({
  selector: 'wdc-alert-description',
  standalone: true,
  template: `<div [class]="computedClass()"><ng-content></ng-content></div>`,
})
export class AlertDescriptionComponent {
  class = input<string>('');
  computedClass = computed(() =>
    // opacity-90 ensures it uses the parent's color (red, green, etc.) but looks slightly muted
    cn('text-sm mt-2 opacity-90 leading-none', this.class()),
  );
}

// EXPORT ARRAY FOR EASY IMPORT
export const ALERT_COMPONENTS = [
  AlertComponent,
  AlertTitleComponent,
  AlertDescriptionComponent,
] as const;
