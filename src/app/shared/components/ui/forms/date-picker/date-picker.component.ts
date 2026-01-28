import {
  Component,
  input,
  signal,
  computed,
  forwardRef,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../../icon/icon.component';
import { UxCalendarComponent } from '../../uxcalendar/calendar.component';

// --- STYLES (Match Input & Select exactly) ---
const dateTriggerVariants = cva(
  'flex w-full items-center justify-between rounded-md border-2 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px]',
  {
    variants: {
      status: {
        default: 'border-input focus:border-primary',
        error: 'border-danger text-danger focus:border-danger',
        success: 'border-success text-success focus:border-success',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  },
);

@Component({
  selector: 'wdc-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, UxCalendarComponent, DatePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full space-y-1.5 relative" #container>
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
        <div class="flex items-center gap-2">
          <wdc-icon name="calendar_month" size="18" class="text-muted-foreground opacity-70" />

          <span [class.text-muted-foreground]="!value()">
            {{ (value() | date: format()) || placeholder() }}
          </span>
        </div>
      </button>

      @if (isOpen()) {
        <div
          class="absolute z-50 mt-1 w-auto rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-md animate-in fade-in zoom-in-95"
          (click)="$event.stopPropagation()"
        >
          <wdc-calendar [selectedDate]="value()" (onSelect)="onDateSelected($event)" />
        </div>
      }

      @if (error()) {
        <p class="text-[0.8rem] font-medium text-danger animate-in slide-in-from-top-1">
          {{ error() }}
        </p>
      } @else if (hint()) {
        <p class="text-[0.8rem] text-muted-foreground">{{ hint() }}</p>
      }
    </div>
  `,
})
export class DatePickerComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);

  // --- INPUTS ---
  label = input<string>('');
  placeholder = input<string>('Pick a date');
  format = input<string>('mediumDate'); // Angular DatePipe format

  error = input<string | null>(null);
  success = input<boolean>(false);
  hint = input<string | null>(null);
  required = input<boolean>(false);
  class = input<string>('');

  // --- STATE ---
  value = signal<Date | null>(null);
  isOpen = signal(false);
  isDisabled = signal(false);

  // --- COMPUTED ---
  computedTriggerClass = computed(() =>
    cn(
      dateTriggerVariants({
        status: this.error() ? 'error' : this.success() ? 'success' : 'default',
      }),
      this.class(),
    ),
  );

  // --- ACTIONS ---
  toggle() {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
  }

  onDateSelected(date: Date) {
    this.value.set(date);
    this.onChange(date);
    this.isOpen.set(false); // Close on selection
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }

  // --- CVA BOILERPLATE ---
  onChange = (date: Date | null) => {};
  onTouched = () => {};

  writeValue(val: Date | string | null): void {
    if (!val) {
      this.value.set(null);
    } else {
      // Handle string or Date object
      this.value.set(new Date(val));
    }
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
}
