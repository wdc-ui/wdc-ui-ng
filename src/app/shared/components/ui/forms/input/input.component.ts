import {
  Component,
  input,
  signal,
  computed,
  forwardRef,
  contentChild,
  Directive,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { InputPrefixDirective, InputSuffixDirective } from './input.directives';
import { IconComponent } from '../../icon/icon.component';
export * from './input.directives';

// --- 2. VARIANTS CONFIGURATION ---
const inputVariants = cva(
  'flex w-full rounded-md border-2 border-input bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      status: {
        default: 'border-input focus-visible:border-ring',
        error: 'border-danger focus-visible:ring-danger text-danger placeholder:text-danger/60',
        success: 'border-success focus-visible:ring-success text-success', // Green Border & Text
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
  // Directives ko import karna zaroori hai
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
            <span class="text-danger">*</span>
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
          (input)="onInput($event)"
          (blur)="onBlur()"
          [class]="computedClass()"
        />

        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <div class="text-muted-foreground pointer-events-none">
            <ng-content select="[wdcSuffix]"></ng-content>
          </div>

          @if (type() === 'password') {
            <button
              type="button"
              (click)="togglePassword()"
              [disabled]="isDisabled()"
              class="text-muted-foreground hover:text-foreground focus:outline-none disabled:opacity-50 flex items-center"
            >
              @if (showPassword()) {
                <wdc-icon name="visibility_off" size="18"></wdc-icon>
              } @else {
                <wdc-icon name="visibility" size="18"></wdc-icon>
              }
            </button>
          }
        </div>
      </div>

      @if (error()) {
        <p class="text-[0.8rem] font-medium text-danger animate-in slide-in-from-top-1">
          {{ error() }}
        </p>
      } @else if (success()) {
        <p class="text-[0.8rem] font-medium text-success animate-in slide-in-from-top-1">
          {{ successMessage() }}
        </p>
      } @else if (hint()) {
        <p class="text-[0.8rem] text-muted-foreground">
          {{ hint() }}
        </p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  inputId = `wdc-input-${nextId++}`;

  // Detect projected content automatically
  prefixContent = contentChild(InputPrefixDirective);
  suffixContent = contentChild(InputSuffixDirective);

  label = input<string>('');
  type = input<'text' | 'email' | 'password' | 'number'>('text');
  placeholder = input<string>('');

  // Validation Inputs
  error = input<string | null>(null);
  success = input<boolean | undefined>(false);
  successMessage = input<string>('Looks good!');

  hint = input<string | null>(null);
  required = input<boolean>(false);
  class = input<string>('');
  size = input<'sm' | 'default' | 'lg'>('default');

  value = signal<string>('');
  isDisabled = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  currentType = computed(() => {
    if (this.type() === 'password' && this.showPassword()) return 'text';
    return this.type();
  });

  computedClass = computed(() => {
    // 1. Determine Status
    let currentStatus: 'default' | 'error' | 'success' = 'default';
    if (this.error()) currentStatus = 'error';
    else if (this.success()) currentStatus = 'success';

    // 2. Determine Padding Logic (Auto-Detect)
    const hasPrefix = !!this.prefixContent();

    const hasSuffix = !!this.suffixContent() || this.type() === 'password';

    return cn(
      inputVariants({ status: currentStatus, size: this.size() }),
      hasPrefix ? 'pl-10' : '', // Auto Left Padding
      hasSuffix ? 'pr-10' : '', // Auto Right Padding
      this.class(),
    );
  });

  // --- CVA Boilerplate ---
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
