import { Component, input, signal, forwardRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from '@shared/utils/cn';

let nextId = 0;

@Component({
  selector: 'wdc-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex items-center gap-3">
      <button
        type="button"
        role="checkbox"
        [id]="id"
        [attr.aria-checked]="checked()"
        [attr.data-state]="checked() ? 'checked' : 'unchecked'"
        [disabled]="isDisabled()"
        (click)="toggle()"
        [class]="computedClass()"
      >
        <span
          class="flex items-center justify-center text-current transition-opacity duration-200"
          [class.opacity-0]="!checked()"
          [class.opacity-100]="checked()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      </button>

      <div class="grid gap-1.5 leading-none">
        <label
          [for]="id"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
          [class.opacity-70]="isDisabled()"
        >
          {{ label() }}
        </label>
        @if (description()) {
          <p class="text-sm text-muted-foreground">{{ description() }}</p>
        }
      </div>
    </div>
  `,
})
export class CheckboxComponent implements ControlValueAccessor {
  id = `wdc-checkbox-${nextId++}`;

  label = input.required<string>();
  description = input<string>('');
  class = input('');

  // Internal State
  checked = signal(false);
  isDisabled = signal(false);

  computedClass = computed(() =>
    cn(
      'peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      this.class(),
    ),
  );

  // --- CVA Implementation ---
  onChange = (val: boolean) => {};
  onTouched = () => {};

  toggle() {
    if (this.isDisabled()) return;
    this.checked.update((v) => !v);
    this.onChange(this.checked()); // Notify Forms
    this.onTouched();
  }

  // Called by Angular to write value (from ngModel or formControl)
  writeValue(val: boolean): void {
    this.checked.set(!!val);
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
