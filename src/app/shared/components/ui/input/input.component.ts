import {
  Component,
  input,
  signal,
  computed,
  forwardRef,
  contentChild,
  booleanAttribute,
  Directive,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../icon/icon.component';

// --- DIRECTIVES (Keep these simple) ---
@Directive({ selector: '[wdcPrefix]', standalone: true })
export class InputPrefixDirective {}

@Directive({ selector: '[wdcSuffix]', standalone: true })
export class InputSuffixDirective {}

// --- VARIANT CONFIGURATION ---
const inputVariants = cva(
  // Base Styles: border-2, no focus ring, transition
  'flex w-full rounded-md border-2 bg-background py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      status: {
        default: 'border-input focus-visible:border-primary', // Default gray -> Primary on focus
        error: 'border-danger focus-visible:border-danger',
        success: 'border-success focus-visible:border-success',
      },
      size: {
        sm: 'h-8 text-xs px-2',
        default: 'h-10 text-sm px-3',
        lg: 'h-12 text-base px-4',
      },
    },
    defaultVariants: {
      status: 'default',
      size: 'default',
    },
  },
);

let nextId = 0;

@Component({
  selector: 'wdc-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputPrefixDirective,
    InputSuffixDirective,
    IconComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full space-y-1.5">
      @if (label()) {
        <label
          [for]="inputId"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          [class.text-danger]="error()"
          [class.text-success]="!error() && success()"
        >
          {{ label() }}
          @if (required()) {
            <span class="text-danger ml-0.5">*</span>
          }
        </label>
      }

      <div class="relative group">
        <div
          class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center"
        >
          <ng-content select="[wdcPrefix]"></ng-content>
        </div>

        <input
          [id]="inputId"
          [type]="currentType()"
          [value]="value()"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
          [required]="required()"
          [attr.aria-invalid]="!!error()"
          [attr.aria-describedby]="hintId"
          (input)="onInput($event)"
          (blur)="onBlur()"
          [class]="computedClass()"
        />

        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <div class="text-muted-foreground pointer-events-none flex items-center">
            <ng-content select="[wdcSuffix]"></ng-content>
          </div>

          @if (type() === 'password') {
            <button
              type="button"
              (click)="togglePassword()"
              [disabled]="isDisabled()"
              tabindex="-1"
              [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
              class="text-muted-foreground hover:text-foreground focus:outline-none disabled:opacity-50 flex items-center cursor-pointer"
            >
              @if (showPassword()) {
                <wdc-icon name="visibility_off" size="18" />
              } @else {
                <wdc-icon name="visibility" size="18" />
              }
            </button>
          }
        </div>
      </div>

      @if (error()) {
        <p
          [id]="hintId"
          class="text-[0.8rem] font-medium text-danger animate-in slide-in-from-top-1"
        >
          {{ error() }}
        </p>
      } @else if (success()) {
        <p
          [id]="hintId"
          class="text-[0.8rem] font-medium text-success animate-in slide-in-from-top-1"
        >
          {{ successMessage() }}
        </p>
      } @else if (hint()) {
        <p [id]="hintId" class="text-[0.8rem] text-muted-foreground">
          {{ hint() }}
        </p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  inputId = `wdc-input-${nextId++}`;
  hintId = `${this.inputId}-hint`;

  // Content Children Signals (Angular 17+)
  prefixContent = contentChild(InputPrefixDirective);
  suffixContent = contentChild(InputSuffixDirective);

  // Inputs
  label = input<string>('');
  type = input<'text' | 'email' | 'password' | 'number'>('text');
  placeholder = input<string>('');
  hint = input<string | null>(null);

  // Validation
  error = input<string | null>(null);
  success = input<boolean | undefined>(false);
  successMessage = input<string>('Looks good!');
  required = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });

  // Styling
  class = input<string>('');
  size = input<'sm' | 'default' | 'lg'>('default');

  // Internal State
  value = signal<string>('');
  isDisabled = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  // 1. Rename internal signal to 'innerValue'
  protected innerValue = signal<string>('');

  // 2. Add an Input alias for 'value' so users can pass static values
  inputValue = input<string>('', { alias: 'value' });

  constructor() {
    // 3. Sync the Input value to the Internal state
    effect(() => {
      // Agar user ne <wdc-input value="test"> diya hai, to usse update karo
      if (this.inputValue() !== this.innerValue()) {
        this.innerValue.set(this.inputValue());
      }
    });
  }

  currentType = computed(() => {
    if (this.type() === 'password' && this.showPassword()) return 'text';
    return this.type();
  });

  computedClass = computed(() => {
    const hasPrefix = !!this.prefixContent();
    const hasSuffix = !!this.suffixContent() || this.type() === 'password';

    let currentStatus: 'default' | 'error' | 'success' = 'default';
    if (this.error()) currentStatus = 'error';
    else if (this.success()) currentStatus = 'success';

    return cn(
      inputVariants({ status: currentStatus, size: this.size() }),
      hasPrefix ? 'pl-10' : '',
      hasSuffix ? 'pr-10' : '',
      this.class(),
    );
  });

  // --- CVA ---
  onChange = (value: string) => {};
  onTouched = () => {};

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  onBlur() {
    this.onTouched();
  }
  writeValue(value: string): void {
    this.value.set(value || '');
    // this.innerValue.set(value || '');
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
  togglePassword() {
    this.showPassword.update((v) => !v);
  }
}

export const INPUT_COMPONENTS = [
  InputComponent,
  InputPrefixDirective,
  InputSuffixDirective,
] as const;
