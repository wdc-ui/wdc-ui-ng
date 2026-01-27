import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { IconName } from './icons.type';

// --- CVA CONFIGURATION ---
const iconVariants = cva(
  'material-symbols-outlined inline-flex items-center justify-center leading-none align-middle select-none transition-colors duration-200 overflow-hidden',
  {
    variants: {
      size: {
        '10': 'h-[10px] w-[10px] text-[10px]',
        '12': 'h-[12px] w-[12px] text-[12px]',
        '14': 'h-[14px] w-[14px] text-[14px]',
        '16': 'h-[16px] w-[16px] text-[16px]',
        '18': 'h-[18px] w-[18px] text-[18px]',
        '20': 'h-[20px] w-[20px] text-[20px]',
        '22': 'h-[22px] w-[22px] text-[22px]',
        '24': 'h-[24px] w-[24px] text-[24px]',
        '28': 'h-[28px] w-[28px] text-[28px]',
        '32': 'h-[32px] w-[32px] text-[32px]',
        '40': 'h-[40px] w-[40px] text-[40px]',
        '48': 'h-[48px] w-[48px] text-[48px]',
        '56': 'h-[56px] w-[56px] text-[56px]',
      },
      color: {
        default: 'text-current',
        primary: 'text-primary',
        secondary: 'text-secondary',
        success: 'text-success',
        danger: 'text-destructive',
        warning: 'text-warning',
        info: 'text-info',
        muted: 'text-muted-foreground',
        white: 'text-white',
      },
    },
    defaultVariants: {
      size: '24',
      color: 'default',
    },
  },
);

export type IconProps = VariantProps<typeof iconVariants>;

@Component({
  selector: 'wdc-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      [class]="computedClass()"
      [style.font-size.px]="size()"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.font-variation-settings]="fontVariationSettings()"
      [attr.aria-hidden]="!ariaLabel()"
      [attr.aria-label]="ariaLabel()"
      [attr.role]="ariaLabel() ? 'img' : 'presentation'"
    >
      {{ name() }}
    </span>
  `,
})
export class IconComponent {
  name = input.required<IconName | (string & {})>();

  // Style Inputs
  size = input<IconProps['size']>('24');
  color = input<IconProps['color']>('default');
  class = input<string>('');
  ariaLabel = input<string | null>(null);

  fill = input<boolean>(false);
  fontVariationSettings = computed(() => {
    // 'FILL' 1 = Filled, 0 = Outlined
    // 'opsz' = Optical Size (Best rendering for specific size)
    return `'FILL' ${this.fill() ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${this.size()}`;
  });

  computedClass = computed(() =>
    cn(iconVariants({ size: this.size(), color: this.color() }), this.class()),
  );
}
