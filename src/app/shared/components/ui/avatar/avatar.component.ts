import {
  Component,
  input,
  signal,
  computed,
  ElementRef,
  Directive,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';

// --- 1. AVATAR CONTAINER VARIANTS ---
const avatarVariants = cva(
  'relative flex shrink-0 overflow-visible', // Overflow visible zaroori hai indicator ke liye
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        default: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-base',
        xl: 'h-20 w-20 text-xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-none',
        rounded: 'rounded-md',
      },
    },
    defaultVariants: {
      size: 'default',
      shape: 'circle',
    },
  },
);

export type AvatarProps = VariantProps<typeof avatarVariants>;

// --- 2. MAIN AVATAR COMPONENT ---
@Component({
  selector: 'wdc-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClass()">
      <div [class]="innerClass()">
        <ng-content></ng-content>
      </div>

      <ng-content select="wdc-avatar-indicator"></ng-content>
    </div>
  `,
})
export class AvatarComponent {
  size = input<AvatarProps['size']>('default');
  shape = input<AvatarProps['shape']>('circle');
  class = input('');

  computedClass = computed(() =>
    cn(avatarVariants({ size: this.size(), shape: this.shape() }), this.class()),
  );

  innerClass = computed(() =>
    cn(
      'flex h-full w-full items-center justify-center overflow-hidden', // Image clipping logic
      this.shape() === 'circle'
        ? 'rounded-full'
        : this.shape() === 'rounded'
          ? 'rounded-md'
          : 'rounded-none',
    ),
  );
}

// --- 3. AVATAR IMAGE (Handles Error State) ---
@Directive({
  selector: 'img[wdcAvatarImage]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
    '[style.display]': 'hasError() ? "none" : "block"',
  },
})
export class AvatarImageDirective {
  class = input('');
  hasError = signal(false);

  @HostListener('error')
  onError() {
    this.hasError.set(true);
  }

  // --- CHANGE IS HERE ---
  // Added: 'absolute inset-0' (This makes image cover the fallback)
  computedClass = computed(() => cn('absolute inset-0 h-full w-full object-cover', this.class()));
}

// --- 4. AVATAR FALLBACK (Initials) ---
@Component({
  selector: 'wdc-avatar-fallback',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'computedClass()',
  },
})
export class AvatarFallbackComponent {
  class = input('');
  // Use muted background for fallback
  computedClass = computed(() =>
    cn(
      'flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium',
      this.class(),
    ),
  );
}

// --- 5. STATUS INDICATOR ---
const indicatorVariants = cva(
  'absolute block rounded-full ring-2 ring-background', // Ring creates the "cutout" effect
  {
    variants: {
      status: {
        online: 'bg-green-500',
        offline: 'bg-slate-400',
        busy: 'bg-red-500',
        away: 'bg-yellow-500',
      },
      position: {
        'bottom-right': 'bottom-0 right-0',
        'top-right': 'top-0 right-0',
        'bottom-left': 'bottom-0 left-0',
      },
      size: {
        // Indicator size should adjust relative to avatar
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        default: 'h-3 w-3',
        lg: 'h-4 w-4',
        xl: 'h-5 w-5',
      },
    },
    defaultVariants: {
      status: 'online',
      position: 'bottom-right',
      size: 'default',
    },
  },
);

@Component({
  selector: 'wdc-avatar-indicator',
  standalone: true,
  template: '',
  host: {
    '[class]': 'computedClass()',
  },
})
export class AvatarIndicatorComponent {
  status = input<'online' | 'offline' | 'busy' | 'away'>('online');
  position = input<'bottom-right' | 'top-right' | 'bottom-left'>('bottom-right');
  size = input<'xs' | 'sm' | 'default' | 'lg' | 'xl'>('default');

  computedClass = computed(() =>
    cn(
      indicatorVariants({
        status: this.status(),
        position: this.position(),
        size: this.size(),
      }),
    ),
  );
}

// --- EXPORT ARRAY ---
export const AVATAR_COMPONENTS = [
  AvatarComponent,
  AvatarImageDirective,
  AvatarFallbackComponent,
  AvatarIndicatorComponent,
] as const;
