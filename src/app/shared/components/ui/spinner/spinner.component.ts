import { Component, input, computed } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';

const spinnerVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    color: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      white: 'text-white',
    },
  },
  defaultVariants: {
    size: 'default',
    color: 'default',
  },
});

export type SpinnerProps = VariantProps<typeof spinnerVariants>;

@Component({
  selector: 'wdc-spinner',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="computedClass()"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  `,
})
export class SpinnerComponent {
  size = input<SpinnerProps['size']>('default');
  color = input<SpinnerProps['color']>('default');
  class = input('');

  computedClass = computed(() =>
    cn(spinnerVariants({ size: this.size(), color: this.color() }), this.class()),
  );
}
