import { Component, input, signal, forwardRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@shared/utils/cn';

@Component({
  selector: 'wdc-switch',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SwitchComponent), multi: true },
  ],
  template: `
    <div class="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        [attr.aria-checked]="checked()"
        [disabled]="isDisabled()"
        (click)="toggle()"
        [class]="computedRootClass()"
      >
        <span [class]="computedThumbClass()"></span>
      </button>

      @if (label()) {
        <label
          class="text-sm font-medium leading-none cursor-pointer"
          (click)="toggle()"
          [class.opacity-50]="isDisabled()"
        >
          {{ label() }}
        </label>
      }
    </div>
  `,
})
export class SwitchComponent implements ControlValueAccessor {
  label = input<string>('');
  class = input('');

  checked = signal(false);
  isDisabled = signal(false);

  // Background Styles
  computedRootClass = computed(() =>
    cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
      this.checked() ? 'bg-primary' : 'bg-input', // Input color for off state
      this.class(),
    ),
  );

  // The Sliding Circle Styles
  computedThumbClass = computed(() =>
    cn(
      'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out',
      this.checked() ? 'translate-x-5' : 'translate-x-0',
    ),
  );

  onChange = (val: boolean) => {};
  onTouched = () => {};

  toggle() {
    if (this.isDisabled()) return;
    this.checked.update((v) => !v);
    this.onChange(this.checked());
    this.onTouched();
  }

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
