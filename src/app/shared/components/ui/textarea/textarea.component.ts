import {
  Component,
  input,
  signal,
  computed,
  forwardRef,
  effect,
  booleanAttribute,
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
import { NoteBlockComponent } from '@shared/components/note-block/note-block.component';
import { MarkdownViewerComponent } from '@shared/components/markdown-viewer/markdown-viewer.component';

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border-2 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
  {
    variants: {
      status: {
        default: 'border-input focus-visible:border-primary',
        error: 'border-danger focus-visible:border-danger',
        success: 'border-success focus-visible:border-success',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  },
);

let nextId = 0;

@Component({
  selector: 'wdc-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  template: `
    <div class="grid w-full gap-1.5">
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

      <textarea
        [id]="inputId"
        [value]="innerValue()"
        [placeholder]="placeholder()"
        [disabled]="isEffectivelyDisabled()"
        [required]="required()"
        [rows]="rows()"
        [attr.aria-invalid]="!!error()"
        [attr.aria-describedby]="hintId"
        (input)="onInput($event)"
        (blur)="onBlur()"
        [class]="computedClass()"
      ></textarea>

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
export class TextareaComponent implements ControlValueAccessor {
  inputId = `wdc-textarea-${nextId++}`;
  hintId = `${this.inputId}-hint`;

  label = input<string>('');
  placeholder = input<string>('');
  hint = input<string | null>(null);
  rows = input<number>(3);

  error = input<string | null>(null);
  success = input<boolean | undefined>(false);
  successMessage = input<string>('Looks good!');
  required = input(false, { transform: booleanAttribute });
  class = input<string>('');

  // --- [FIX START] ---
  // 1. Add the missing Input
  disabled = input(false, { transform: booleanAttribute });

  protected isDisabledSignal = signal(false);
  isEffectivelyDisabled = computed(() => this.disabled() || this.isDisabledSignal());

  protected innerValue = signal<string>('');
  inputValue = input<string | undefined>(undefined, { alias: 'value' });

  constructor() {
    effect(() => {
      const staticVal = this.inputValue();
      if (staticVal !== undefined && staticVal !== this.innerValue()) {
        this.innerValue.set(staticVal);
      }
    });
  }

  computedClass = computed(() => {
    let currentStatus: 'default' | 'error' | 'success' = 'default';
    if (this.error()) currentStatus = 'error';
    else if (this.success()) currentStatus = 'success';

    return cn(textareaVariants({ status: currentStatus }), this.class());
  });

  onChange = (val: string) => {};
  onTouched = () => {};

  onInput(e: Event) {
    const val = (e.target as HTMLTextAreaElement).value;
    this.innerValue.set(val);
    this.onChange(val);
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(val: string): void {
    this.innerValue.set(val || '');
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.isDisabledSignal.set(d);
  }
}
