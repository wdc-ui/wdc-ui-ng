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
  booleanAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../icon/icon.component';

// --- STYLES (Exact match with Input: Border-2, No Ring) ---
const selectTriggerVariants = cva(
  'flex w-full items-center justify-between rounded-md border-2 bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      status: {
        default: 'border-input focus:border-primary', // Default gray -> Primary on focus
        error: 'border-danger text-danger focus:border-danger',
        success: 'border-success text-success focus:border-success',
      },
      size: {
        sm: 'h-8 text-xs',
        default: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      status: 'default',
      size: 'default',
    },
  },
);

@Component({
  selector: 'wdc-select',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
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
        [disabled]="isEffectivelyDisabled()"
        (click)="toggle()"
        [class]="computedTriggerClass()"
        [attr.aria-expanded]="isOpen()"
        class="group"
      >
        <span [class.text-muted-foreground]="!value()" class="truncate">
          {{ displayLabel() || placeholder() }}
        </span>

        <wdc-icon
          name="keyboard_arrow_down"
          size="18"
          class="text-muted-foreground transition-transform duration-200 opacity-50 group-hover:opacity-100"
          [class.rotate-180]="isOpen()"
        />
      </button>

      @if (isOpen()) {
        <div
          class="absolute z-50 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in zoom-in-95"
        >
          @if (searchable()) {
            <div class="flex items-center border-b px-3 py-2 sticky top-0 bg-popover z-10">
              <wdc-icon name="search" size="16" class="mr-2 opacity-50" />
              <input
                #searchInput
                type="text"
                [ngModel]="searchQuery()"
                (ngModelChange)="onSearch($event)"
                class="flex h-4 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search..."
                (click)="$event.stopPropagation()"
              />
            </div>
          }

          <div class="max-h-60 overflow-y-auto p-1">
            @for (item of filteredOptions(); track $index) {
              <div
                (click)="selectOption(item)"
                class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                [class.bg-accent]="isSelected(item)"
                [class.text-accent-foreground]="isSelected(item)"
              >
                {{ getOptionLabel(item) }}

                @if (isSelected(item)) {
                  <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <wdc-icon name="check" size="14" />
                  </span>
                }
              </div>
            }

            @if (filteredOptions().length === 0) {
              <div class="py-6 text-center text-sm text-muted-foreground">No options found.</div>
            }
          </div>
        </div>
      }

      @if (error()) {
        <p class="text-[0.8rem] font-medium text-danger animate-in slide-in-from-top-1">
          {{ error() }}
        </p>
      } @else if (success()) {
        <p class="text-[0.8rem] font-medium text-success animate-in slide-in-from-top-1">
          Looks good!
        </p>
      } @else if (hint()) {
        <p class="text-[0.8rem] text-muted-foreground">{{ hint() }}</p>
      }
    </div>
  `,
})
export class SelectComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // --- INPUTS ---
  label = input<string>('');
  placeholder = input<string>('Select an option');

  options = input.required<any[]>();
  bindLabel = input<string>('label');
  bindValue = input<string>('value');

  searchable = input<boolean>(true);

  error = input<string | null>(null);
  success = input<boolean>(false);
  hint = input<string | null>(null);
  required = input<boolean>(false);

  class = input<string>('');
  size = input<'sm' | 'default' | 'lg'>('default');

  // --- STATE ---
  value = signal<any>(null);
  isOpen = signal(false);
  isDisabled = signal(false);
  searchQuery = signal('');

  disabled = input(false, { transform: booleanAttribute });

  protected isDisabledSignal = signal(false);
  isEffectivelyDisabled = computed(() => this.disabled() || this.isDisabledSignal());

  // --- COMPUTED ---
  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const allOptions = this.options();
    if (!query) return allOptions;
    return allOptions.filter((item) => this.getOptionLabel(item).toLowerCase().includes(query));
  });

  computedTriggerClass = computed(() =>
    cn(
      selectTriggerVariants({
        status: this.error() ? 'error' : this.success() ? 'success' : 'default',
        size: this.size(),
      }),
      this.class(),
    ),
  );

  displayLabel = computed(() => {
    const val = this.value();
    if (val === null || val === undefined || val === '') return '';

    const selectedOption = this.options().find((opt) => {
      const optVal = this.getOptionValue(opt);
      return optVal == val;
    });

    return selectedOption ? this.getOptionLabel(selectedOption) : val;
  });

  // --- HELPERS ---
  getOptionLabel(item: any): string {
    if (item && typeof item === 'object') {
      return item[this.bindLabel()] || '';
    }
    return String(item);
  }

  getOptionValue(item: any): any {
    if (item && typeof item === 'object') {
      return this.bindValue() ? item[this.bindValue()] : item;
    }
    return item;
  }

  isSelected(item: any): boolean {
    return this.getOptionValue(item) === this.value();
  }

  // --- ACTIONS ---
  toggle() {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);

    if (this.isOpen() && this.searchable()) {
      setTimeout(() => this.searchInput()?.nativeElement.focus(), 50);
    } else {
      this.onTouched();
    }
  }

  selectOption(item: any) {
    const val = this.getOptionValue(item);
    this.value.set(val);
    this.onChange(val);
    this.isOpen.set(false);
    this.searchQuery.set('');
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }

  // --- CVA ---
  onChange = (val: any) => {};
  onTouched = () => {};
  writeValue(obj: any): void {
    this.value.set(obj);
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
