import { Component, input, computed, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';

// --- CVA CONFIGURATION ---
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      // 1. Style Mode (Solid vs Outline)
      variant: {
        solid: 'border-transparent text-white shadow',
        outline: 'bg-transparent border', // Border color will come from 'color' variant
        ghost: 'bg-transparent border-transparent',
      },
      // 2. Branding Colors
      color: {
        primary: '',
        secondary: '',
        success: '',
        danger: '',
        warning: '',
        info: '',
        dark: '',
        light: '',
      },
      // 3. Sizes
      size: {
        sm: 'text-[10px] px-2 h-5', // Tiny
        default: 'text-xs px-2.5 h-6', // Normal
        lg: 'text-sm px-3 h-7', // Large
        icon: 'h-6 w-6 px-0 flex items-center justify-center', // Circular for count
      },
      // 4. Shape
      rounded: {
        pill: 'rounded-full', // Default badge look
        md: 'rounded-md', // Square-ish
        sm: 'rounded-sm',
      },
    },
    // --- COMPOUND VARIANTS (Mixing Color + Mode) ---
    compoundVariants: [
      // SOLID MODE (Background Color)
      {
        variant: 'solid',
        color: 'primary',
        class: 'bg-primary text-primary-foreground hover:bg-primary/80',
      },
      {
        variant: 'solid',
        color: 'secondary',
        class: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
      {
        variant: 'solid',
        color: 'success',
        class: 'bg-success text-success-foreground hover:bg-success/80',
      },
      {
        variant: 'solid',
        color: 'danger',
        class: 'bg-danger text-danger-foreground hover:bg-danger/80',
      }, // Mapping danger to danger
      {
        variant: 'solid',
        color: 'warning',
        class: 'bg-warning text-warning-foreground hover:bg-warning/80',
      },
      { variant: 'solid', color: 'info', class: 'bg-info text-info-foreground hover:bg-info/80' },
      {
        variant: 'solid',
        color: 'dark',
        class: 'bg-slate-900 text-slate-50 hover:bg-slate-900/80',
      },
      { variant: 'solid', color: 'light', class: 'bg-slate-100 text-slate-900 hover:bg-slate-200' },

      // OUTLINE MODE (Border Color + Text Color)
      { variant: 'outline', color: 'primary', class: 'border-primary text-primary' },
      { variant: 'outline', color: 'secondary', class: 'border-secondary text-secondary' },
      { variant: 'outline', color: 'success', class: 'border-success text-success' },
      { variant: 'outline', color: 'danger', class: 'border-danger text-danger' },
      { variant: 'outline', color: 'warning', class: 'border-warning text-warning-foreground' }, // Warning text usually dark
      { variant: 'outline', color: 'info', class: 'border-info text-info' },
      {
        variant: 'outline',
        color: 'dark',
        class: 'border-slate-900 text-slate-900 dark:border-slate-50 dark:text-slate-50',
      },
      { variant: 'outline', color: 'light', class: 'border-slate-200 text-slate-900' },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'default',
      rounded: 'pill',
    },
  },
);

export type BadgeProps = VariantProps<typeof badgeVariants>;

@Component({
  selector: 'wdc-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClasses()">
      <ng-content></ng-content>

      @if (count() !== undefined) {
        <span class="ml-1">{{ displayCount() }}</span>
      }
    </div>
  `,
})
export class BadgeComponent {
  // Inputs
  variant = input<BadgeProps['variant']>('solid');
  color = input<BadgeProps['color']>('primary');
  size = input<BadgeProps['size']>('default');
  rounded = input<BadgeProps['rounded']>('pill');
  userClass = input<string>('', { alias: 'class' });

  // Count Logic
  count = input<number | undefined>(undefined);
  maxCount = input<number>(99); // Agar 99 se zyada hua to 99+ dikhayega

  // Computed Logic
  computedClasses = computed(() => {
    // Agar count only mode chahiye (circular badge), to size='icon' auto set kar sakte hain
    // lekin flexible rakhte hain
    return cn(
      badgeVariants({
        variant: this.variant(),
        color: this.color(),
        size: this.size(),
        rounded: this.rounded(),
      }),
      this.userClass(),
    );
  });

  displayCount = computed(() => {
    const c = this.count();
    const max = this.maxCount();
    if (c === undefined) return '';
    return c > max ? `${max}+` : c;
  });
}
