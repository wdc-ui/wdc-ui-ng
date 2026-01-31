import { Component, input, signal, forwardRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@shared/utils/cn';

// Shared base styles
const baseInputStyles =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px]';

// 1. DATE PICKER
@Component({
  selector: 'wdc-date-picker',
  standalone: true,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true },
  ],
  template: `
    <div class="w-full gap-1.5">
      @if (label()) {
        <label class="text-sm font-medium mb-1 block">{{ label() }}</label>
      }
      <input
        type="date"
        [value]="value()"
        [disabled]="isDisabled()"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [class]="computedClass()"
      />
    </div>
  `,
})
export class DatePickerComponent implements ControlValueAccessor {
  label = input('');
  class = input('');
  value = signal('');
  isDisabled = signal(false);

  // Native date input ke andar ka "calendar icon" style karna mushkil hota hai,
  // isliye hum 'accent-primary' use kar rahe hain (Tailwind v4 feature needed or custom CSS)
  computedClass = computed(() => cn(baseInputStyles, 'cursor-pointer', this.class()));

  onChange = (v: any) => {};
  onTouched = () => {};
  onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }
  writeValue(v: string) {
    this.value.set(v);
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean) {
    this.isDisabled.set(d);
  }
}

// 2. COLOR PICKER
@Component({
  selector: 'wdc-color-picker',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex items-center gap-3">
      <div
        class="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-input shadow-sm"
      >
        <input
          type="color"
          class="absolute -top-2 -left-2 h-16 w-16 cursor-pointer border-none p-0"
          [value]="value()"
          [disabled]="isDisabled()"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
      </div>

      <div class="grid gap-1">
        @if (label()) {
          <label class="text-sm font-medium">{{ label() }}</label>
        }
        <code class="text-xs uppercase text-muted-foreground">{{ value() || '#000000' }}</code>
      </div>
    </div>
  `,
})
export class ColorPickerComponent implements ControlValueAccessor {
  label = input('Color');
  value = signal('#000000');
  isDisabled = signal(false);

  onChange = (v: any) => {};
  onTouched = () => {};
  onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }
  writeValue(v: string) {
    this.value.set(v);
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean) {
    this.isDisabled.set(d);
  }
}

export const PICKER_COMPONENTS = [DatePickerComponent, ColorPickerComponent] as const;
