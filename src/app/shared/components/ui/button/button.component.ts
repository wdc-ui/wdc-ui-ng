import { Component, input, computed, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';

// --- CVA CONFIGURATION ---
const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        solid: 'border border-transparent shadow',
        outline: 'border bg-transparent shadow-sm',
        ghost: 'bg-transparent hover:bg-slate-100 hover:text-slate-900',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      color: {
        primary: '',
        secondary: '',
        success: '',
        danger: '',
        warning: '',
        info: '',
        light: '',
        dark: '',
      },
      gradient: {
        true: 'text-white border-0 shadow-md',
        false: '',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-12 rounded-md px-8 text-lg',
      },
      rounded: {
        default: 'rounded-md',
        full: 'rounded-full',
        none: 'rounded-none',
      },
      // Controls square aspect ratio for icons
      icon: {
        true: 'px-0 shrink-0',
        false: '',
      },
    },
    compoundVariants: [
      // --- ICON SIZE MAPPING (Size + Icon = Square) ---
      { size: 'default', icon: true, class: 'w-10' },
      { size: 'sm', icon: true, class: 'w-9' },
      { size: 'lg', icon: true, class: 'w-12' },

      // --- SOLID COLORS ---
      {
        variant: 'solid',
        color: 'primary',
        gradient: false,
        class: 'bg-primary text-primary-foreground hover:bg-primary/90',
      },
      {
        variant: 'solid',
        color: 'secondary',
        gradient: false,
        class: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      },
      {
        variant: 'solid',
        color: 'success',
        gradient: false,
        class: 'bg-success text-success-foreground hover:bg-success/90',
      },
      {
        variant: 'solid',
        color: 'danger',
        gradient: false,
        class: 'bg-danger text-danger-foreground hover:bg-danger/90',
      },
      {
        variant: 'solid',
        color: 'warning',
        gradient: false,
        class: 'bg-warning text-warning-foreground hover:bg-warning/90',
      },
      {
        variant: 'solid',
        color: 'info',
        gradient: false,
        class: 'bg-info text-info-foreground hover:bg-info/90',
      },
      {
        variant: 'solid',
        color: 'light',
        gradient: false,
        class: 'bg-light text-light-foreground hover:bg-light/80',
      },
      {
        variant: 'solid',
        color: 'dark',
        gradient: false,
        class: 'bg-dark text-dark-foreground hover:bg-dark/90',
      },

      // --- OUTLINE COLORS ---
      {
        variant: 'outline',
        color: 'primary',
        class: 'border-primary text-primary hover:bg-primary hover:text-primary-foreground',
      },
      {
        variant: 'outline',
        color: 'secondary',
        class: 'border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground',
      },
      {
        variant: 'outline',
        color: 'success',
        class: 'border-success text-success hover:bg-success hover:text-success-foreground',
      },
      {
        variant: 'outline',
        color: 'danger',
        class: 'border-danger text-danger hover:bg-danger hover:text-danger-foreground',
      },
      {
        variant: 'outline',
        color: 'warning',
        class: 'border-warning text-warning hover:bg-warning hover:text-warning-foreground',
      },
      {
        variant: 'outline',
        color: 'info',
        class: 'border-info text-info hover:bg-info hover:text-info-foreground',
      },
      {
        variant: 'outline',
        color: 'light',
        class: 'border-light text-light hover:bg-light hover:text-light-foreground',
      },
      {
        variant: 'outline',
        color: 'dark',
        class: 'border-dark text-dark hover:bg-dark hover:text-dark-foreground',
      },

      // --- GRADIENTS ---
      {
        gradient: true,
        color: 'primary',
        class: 'bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500',
      },
      {
        gradient: true,
        color: 'secondary',
        class:
          'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600',
      },
      {
        gradient: true,
        color: 'danger',
        class: 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600',
      },
      {
        gradient: true,
        color: 'success',
        class:
          'bg-gradient-to-r from-green-600 to-emerald-400 hover:from-green-700 hover:to-emerald-500',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'default',
      rounded: 'default',
      gradient: false,
      icon: false,
    },
  },
);

export type ButtonProps = VariantProps<typeof buttonVariants>;

@Component({
  selector: 'wdc-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  // --- Styling Inputs ---
  variant = input<ButtonProps['variant']>('solid');
  color = input<ButtonProps['color']>('primary');
  size = input<ButtonProps['size']>('default');
  rounded = input<ButtonProps['rounded']>('default');

  // --- Boolean Features ---
  gradient = input(false, { transform: booleanAttribute });
  icon = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });

  // --- Functional Inputs ---
  type = input<'button' | 'submit' | 'reset'>('button');
  userClass = input<string>('', { alias: 'class' });

  // --- SEO & Navigation Inputs ---
  href = input<string | undefined>(undefined);
  target = input<string>('_self');
  rel = input<string | undefined>(undefined); // [SEO] For external links
  ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' }); // [SEO/A11y] For icon buttons

  // --- Computed Classes ---
  computedClasses = computed(() => {
    return cn(
      buttonVariants({
        variant: this.variant(),
        color: this.color(),
        size: this.size(),
        rounded: this.rounded(),
        gradient: this.gradient(),
        icon: this.icon(),
      }),
      this.userClass(),
    );
  });

  // --- Helper: Auto-calculate 'rel' for security ---
  computedRel = computed(() => {
    if (this.rel()) return this.rel();
    // If opening in new tab, ensure security best practices
    return this.target() === '_blank' ? 'noopener noreferrer' : undefined;
  });
}
