import { Component, input, signal, forwardRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from '@shared/utils/cn';

@Component({
  selector: 'wdc-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextareaComponent), multi: true },
  ],
  template: `
    <div class="grid w-full gap-1.5">
      @if (label()) {
        <label class="text-sm font-medium leading-none">{{ label() }}</label>
      }

      <textarea
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [rows]="rows()"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [class]="computedClass()"
      ></textarea>

      @if (hint()) {
        <p class="text-[0.8rem] text-muted-foreground">{{ hint() }}</p>
      }
    </div>
  `,
})
export class TextareaComponent implements ControlValueAccessor {
  label = input('');
  placeholder = input('');
  hint = input('');
  rows = input(3);
  class = input('');

  value = signal('');
  isDisabled = signal(false);

  computedClass = computed(() =>
    cn(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );

  onChange = (val: string) => {};
  onTouched = () => {};

  onInput(e: Event) {
    const val = (e.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  // CVA
  writeValue(val: string): void {
    this.value.set(val || '');
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
