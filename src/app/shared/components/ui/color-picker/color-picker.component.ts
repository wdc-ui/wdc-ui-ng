import {
  Component,
  input,
  signal,
  computed,
  forwardRef,
  ElementRef,
  HostListener,
  inject,
  viewChild,
  effect,
  booleanAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../icon/icon.component';

// --- STYLES (Consistent Border-2, No Ring) ---
const colorTriggerVariants = cva(
  'flex w-full items-center gap-2 rounded-md border-2 bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px]',
  {
    variants: {
      status: {
        default: 'border-input focus:border-primary',
        error: 'border-danger focus:border-danger',
        success: 'border-success focus:border-success',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  },
);

@Component({
  selector: 'wdc-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full space-y-0.5 relative" #container>
      @if (label()) {
        <label
          class="text-sm font-medium leading-none cursor-pointer"
          (click)="toggle()"
          [class.text-danger]="error()"
          [class.text-success]="!error() && success()"
        >
          {{ label() }}
          @if (required()) {
            <span class="text-danger ml-0.5">*</span>
          }
        </label>
      }

      <button
        type="button"
        [disabled]="isDisabled()"
        (click)="toggle()"
        [class]="computedTriggerClass()"
        [attr.aria-expanded]="isOpen()"
        class="group text-left"
      >
        <div
          class="h-5 w-5 rounded-sm border border-border shadow-sm shrink-0"
          [style.background-color]="value() || '#ffffff'"
        ></div>

        <span [class.text-muted-foreground]="!value()" class="flex-1 truncate uppercase font-mono">
          {{ value() || placeholder() }}
        </span>

        <wdc-icon
          name="keyboard_arrow_down"
          size="16"
          class="text-muted-foreground transition-transform duration-200 opacity-50 group-hover:opacity-100"
          [class.rotate-180]="isOpen()"
        />
      </button>

      @if (isOpen()) {
        <div
          class="absolute z-50 w-full rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-md animate-in fade-in zoom-in-95"
          (click)="$event.stopPropagation()"
        >
          <div class="flex gap-2 mb-3">
            <div class="relative flex-1">
              <span class="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
                >#</span
              >
              <input
                type="text"
                [ngModel]="hexValue()"
                (ngModelChange)="onHexInput($event)"
                maxlength="7"
                class="w-full h-8 rounded-md border border-input bg-background pl-5 pr-2 text-xs font-mono uppercase focus:outline-none focus:border-primary"
              />
            </div>

            <div
              class="relative w-8 h-8 rounded-md border border-input overflow-hidden cursor-pointer hover:border-primary"
            >
              <input
                type="color"
                [value]="value()"
                (input)="onNativeInput($event)"
                class="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] cursor-pointer p-0 border-0"
              />
              <wdc-icon
                name="pipette"
                size="14"
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-foreground/80"
              />
            </div>
          </div>

          @if (presets().length > 0) {
            <div class="grid grid-cols-5 gap-2">
              @for (color of presets(); track $index) {
                <button
                  type="button"
                  (click)="selectColor(color)"
                  class="h-8 w-8 rounded-md border border-transparent hover:scale-110 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all relative"
                  [style.background-color]="color"
                  [attr.aria-label]="'Select color ' + color"
                >
                  @if (isSameColor(color, value())) {
                    <span class="absolute inset-0 flex items-center justify-center">
                      <wdc-icon name="check" size="14" class="text-white drop-shadow-md" />
                    </span>
                  }
                </button>
              }
            </div>
          }
        </div>
      }

      @if (error()) {
        <p class="text-[0.8rem] font-medium text-danger animate-in slide-in-from-top-1">
          {{ error() }}
        </p>
      } @else if (success()) {
        <p class="text-[0.8rem] font-medium text-success animate-in slide-in-from-top-1">
          {{ successMessage() }}
        </p>
      } @else if (hint()) {
        <p class="text-[0.8rem] text-muted-foreground">{{ hint() }}</p>
      }
    </div>
  `,
})
export class ColorPickerComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);

  // --- INPUTS ---
  label = input<string>('');
  placeholder = input<string>('Select color');

  // Default Tailwind-ish Palette
  presets = input<string[]>([
    '#000000',
    '#ffffff',
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#84cc16',
    '#10b981',
    '#06b6d4',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#d946ef',
    '#f43f5e',
    '#64748b',
    '#71717a',
  ]);

  error = input<string | null>(null);
  success = input<boolean | undefined>(false);
  successMessage = input<string>('Looks good!');
  hint = input<string | null>(null);
  required = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  class = input<string>('');

  // --- STATE ---
  value = signal<string>('');
  hexValue = signal<string>(''); // For the internal input
  isOpen = signal(false);
  isDisabled = signal(false);

  // Combine disabled states
  isEffectivelyDisabled = computed(() => this.disabled() || this.isDisabled());

  computedTriggerClass = computed(() =>
    cn(
      colorTriggerVariants({
        status: this.error() ? 'error' : this.success() ? 'success' : 'default',
      }),
      this.class(),
    ),
  );

  // --- ACTIONS ---

  toggle() {
    if (this.isEffectivelyDisabled()) return;
    this.isOpen.update((v) => !v);

    // Sync internal hex input when opening
    if (this.isOpen() && this.value()) {
      this.hexValue.set(this.value().replace('#', ''));
    }
  }

  selectColor(color: string) {
    this.updateValue(color);
    this.isOpen.set(false);
  }

  onHexInput(val: string) {
    // Basic Hex Validation
    this.hexValue.set(val);
    if (/^[0-9A-Fa-f]{6}$/.test(val)) {
      this.updateValue('#' + val);
    }
  }

  onNativeInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.updateValue(val);
    this.hexValue.set(val.replace('#', ''));
  }

  private updateValue(val: string) {
    this.value.set(val);
    this.onChange(val);
  }

  isSameColor(c1: string, c2: string): boolean {
    return c1?.toLowerCase() === c2?.toLowerCase();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }

  // --- CVA ---
  onChange = (val: string) => {};
  onTouched = () => {};

  writeValue(val: string): void {
    this.value.set(val || '');
    // Strip # for the text input display if needed
    this.hexValue.set(val ? val.replace('#', '') : '');
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.isDisabled.set(d);
  }
}
