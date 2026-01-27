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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../icon/icon.component';

// --- STYLES ---
const multiSelectTriggerVariants = cva(
  'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 min-h-[40px] h-auto',
  {
    variants: {
      status: {
        default: 'border-input focus:border-ring',
        error: 'border-danger focus:ring-danger text-danger',
        success: 'border-success focus:ring-success text-success',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  },
);

@Component({
  selector: 'wdc-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
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
            <span class="text-danger">*</span>
          }
        </label>
      }

      <div
        (click)="toggle()"
        [class]="computedTriggerClass()"
        [attr.aria-expanded]="isOpen()"
        class="cursor-pointer"
      >
        <div class="flex flex-wrap gap-1.5 w-full">
          @for (val of value(); track $index) {
            <span
              class="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground animate-in fade-in zoom-in-95"
              (click)="$event.stopPropagation()"
            >
              {{ getDisplayLabel(val) }}

              <button
                type="button"
                (click)="removeItem(val)"
                class="ml-0.5 rounded-full outline-none hover:bg-secondary-foreground/20 focus:bg-secondary-foreground/20"
              >
                <wdc-icon name="close" size="14" />
              </button>
            </span>
          }

          @if (value().length === 0) {
            <span class="text-muted-foreground py-0.5">{{ placeholder() }}</span>
          }
        </div>

        <div class="shrink-0 ml-2 text-muted-foreground">
          <wdc-icon
            name="keyboard_arrow_down"
            size="20"
            class="transition-transform duration-200"
            [class.rotate-180]="isOpen()"
          />
        </div>
      </div>

      @if (isOpen()) {
        <div
          class="absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in zoom-in-95"
        >
          @if (searchable()) {
            <div class="sticky top-0 z-10 bg-popover p-2 border-b">
              <div class="relative">
                <wdc-icon
                  name="search"
                  size="16"
                  class="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  #searchInput
                  type="text"
                  [ngModel]="searchQuery()"
                  (ngModelChange)="onSearch($event)"
                  placeholder="Search options..."
                  class="w-full rounded-sm border border-input bg-background py-1.5 pl-8 pr-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  (click)="$event.stopPropagation()"
                />
              </div>
            </div>
          }

          <div class="max-h-52 overflow-y-auto p-1 space-y-0.5">
            @for (item of filteredOptions(); track $index) {
              <div
                (click)="toggleOption(item)"
                class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                [attr.data-selected]="isSelected(item)"
              >
                <div
                  class="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary"
                  [class.bg-primary]="isSelected(item)"
                  [class.text-primary-foreground]="isSelected(item)"
                >
                  @if (isSelected(item)) {
                    <wdc-icon name="check" size="14" />
                  }
                </div>

                {{ getOptionLabel(item) }}
              </div>
            }

            @if (filteredOptions().length === 0) {
              <div class="py-6 text-center text-sm text-muted-foreground">No results found.</div>
            }
          </div>
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
export class MultiSelectComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // --- INPUTS ---
  label = input<string>('');
  placeholder = input<string>('Select items...');

  options = input.required<any[]>();
  bindLabel = input<string>('label');
  bindValue = input<string>('value');

  searchable = input<boolean>(true);
  error = input<string | null>(null);
  success = input<boolean>(false);
  hint = input<string | null>(null);
  required = input<boolean>(false);
  class = input<string>('');

  // --- STATE ---
  value = signal<any[]>([]); // Array of selected values
  isOpen = signal(false);
  isDisabled = signal(false);
  searchQuery = signal('');

  // --- COMPUTED ---

  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const allOptions = this.options();
    if (!query) return allOptions;
    return allOptions.filter((item) => this.getOptionLabel(item).toLowerCase().includes(query));
  });

  computedTriggerClass = computed(() =>
    cn(
      multiSelectTriggerVariants({
        status: this.error() ? 'error' : this.success() ? 'success' : 'default',
      }),
      this.class(),
    ),
  );

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

  // Used for Chips Display
  getDisplayLabel(val: any): string {
    // Value could be an ID (if bindValue used) or Object
    // Find the full object from options to get the label
    const found = this.options().find((opt) => {
      // Loose equality for string/number match
      return this.getOptionValue(opt) == (typeof val === 'object' ? this.getOptionValue(val) : val);
    });
    return found ? this.getOptionLabel(found) : String(val);
  }

  isSelected(item: any): boolean {
    const itemVal = this.getOptionValue(item);
    return this.value().some((v) => v == itemVal);
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

  toggleOption(item: any) {
    const itemVal = this.getOptionValue(item);
    const currentValues = this.value();
    const exists = this.isSelected(item);

    let newValues;
    if (exists) {
      // Remove
      newValues = currentValues.filter((v) => v != itemVal);
    } else {
      // Add
      newValues = [...currentValues, itemVal];
    }

    this.value.set(newValues);
    this.onChange(newValues);
    // Don't close dropdown on multi-select toggle
    this.searchQuery.set('');
    this.searchInput()?.nativeElement.focus(); // Keep focus
  }

  removeItem(val: any) {
    if (this.isDisabled()) return;
    const newValues = this.value().filter((v) => v != val);
    this.value.set(newValues);
    this.onChange(newValues);
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
  onChange = (val: any[]) => {};
  onTouched = () => {};
  writeValue(obj: any[]): void {
    this.value.set(Array.isArray(obj) ? obj : []);
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
