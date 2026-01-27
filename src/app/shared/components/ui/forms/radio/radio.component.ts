import {
  Component,
  input,
  signal,
  computed,
  inject,
  forwardRef,
  InjectionToken,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@shared/utils/cn';

// Dependency Injection Token for Parent-Child communication
export const RADIO_GROUP_TOKEN = new InjectionToken<RadioGroupComponent>('RADIO_GROUP');

// --- 1. PARENT: RADIO GROUP ---
@Component({
  selector: 'wdc-radio-group',
  standalone: true,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioGroupComponent), multi: true },
    { provide: RADIO_GROUP_TOKEN, useExisting: RadioGroupComponent },
  ],
  template: `
    <div [class]="computedClass()" role="radiogroup">
      <ng-content></ng-content>
    </div>
  `,
})
export class RadioGroupComponent implements ControlValueAccessor {
  class = input('grid gap-2');

  // State
  value = signal<any>(null);
  isDisabled = signal(false);

  computedClass = computed(() => cn('grid gap-2', this.class()));

  onChange = (val: any) => {};
  onTouched = () => {};

  // Method called by children
  select(val: any) {
    if (this.isDisabled()) return;
    this.value.set(val);
    this.onChange(val);
    this.onTouched();
  }

  // CVA
  writeValue(val: any): void {
    this.value.set(val);
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

// --- 2. CHILD: RADIO ITEM ---
let radioId = 0;

@Component({
  selector: 'wdc-radio-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center space-x-2">
      <button
        type="button"
        role="radio"
        [id]="id"
        [attr.aria-checked]="isChecked()"
        [attr.data-state]="isChecked() ? 'checked' : 'unchecked'"
        [disabled]="group.isDisabled() || disabled()"
        (click)="group.select(value())"
        [class]="computedButtonClass()"
      >
        <span class="flex items-center justify-center">
          <span
            class="h-2.5 w-2.5 rounded-full bg-current transition-all scale-0"
            [class.scale-100]="isChecked()"
          ></span>
        </span>
      </button>

      <label
        [for]="id"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        [class.opacity-50]="group.isDisabled() || disabled()"
      >
        <ng-content></ng-content>
      </label>
    </div>
  `,
})
export class RadioItemComponent {
  group = inject(RADIO_GROUP_TOKEN);
  id = `wdc-radio-${radioId++}`;

  value = input.required<any>();
  disabled = input(false);
  class = input('');

  isChecked = computed(() => this.group.value() === this.value());

  computedButtonClass = computed(() =>
    cn(
      'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );
}

// Export Array
export const RADIO_COMPONENTS = [RadioGroupComponent, RadioItemComponent] as const;
