import {
  Component,
  input,
  signal,
  computed,
  forwardRef,
  ElementRef,
  HostListener,
  inject,
  contentChild,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../icon/icon.component';

// --- STYLES (Matching Input) ---
const selectTriggerVariants = cva(
  'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      status: {
        default: 'border-input focus:border-ring',
        error: 'border-danger focus:ring-danger text-danger',
        success: 'border-success focus:ring-success text-success',
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

      <button
        type="button"
        [disabled]="isDisabled()"
        (click)="toggle()"
        [class]="computedTriggerClass()"
        [attr.aria-expanded]="isOpen()"
      >
        <span [class.text-muted-foreground]="!value()" class="truncate">
          {{ displayLabel() || placeholder() }}
        </span>

        <wdc-icon
          name="keyboard_arrow_down"
          size="20"
          class="text-muted-foreground transition-transform duration-200"
          [class.rotate-180]="isOpen()"
        />
      </button>

      @if (isOpen()) {
        <div
          class="absolute z-50 max-h-60 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in zoom-in-95"
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
                  placeholder="Search..."
                  class="w-full rounded-sm border border-input bg-background py-1.5 pl-8 pr-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  (click)="$event.stopPropagation()"
                />
              </div>
            </div>
          }

          <div class="max-h-52 overflow-y-auto p-1 space-y-0.5">
            @for (item of filteredOptions(); track $index) {
              <div
                (click)="selectOption(item)"
                class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                [attr.data-selected]="isSelected(item)"
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
export class SelectComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // --- INPUTS ---
  label = input<string>('');
  placeholder = input<string>('Select an option');

  options = input.required<any[]>();
  bindLabel = input<string>('label'); // Key to display
  bindValue = input<string>('value'); // Key to save

  searchable = input<boolean>(true); // Enable/Disable search

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

  // --- COMPUTED ---

  // Filter Options based on Search
  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const allOptions = this.options();

    if (!query) return allOptions;

    return allOptions.filter((item) => this.getOptionLabel(item).toLowerCase().includes(query));
  });

  // Calculate Trigger Styles
  computedTriggerClass = computed(() =>
    cn(
      selectTriggerVariants({
        status: this.error() ? 'error' : this.success() ? 'success' : 'default',
        size: this.size(),
      }),
      this.class(),
    ),
  );

  // Find Label for the selected Value
  displayLabel = computed(() => {
    const val = this.value();
    if (val === null || val === undefined || val === '') return '';

    // Find the full object from the original options
    const selectedOption = this.options().find((opt) => {
      const optVal = this.getOptionValue(opt);
      // Loose equality check for number/string mismatch (e.g. "1" == 1)
      return optVal == val;
    });

    return selectedOption ? this.getOptionLabel(selectedOption) : val;
  });

  // --- HELPER METHODS ---

  getOptionLabel(item: any): string {
    if (item && typeof item === 'object') {
      return item[this.bindLabel()] || '';
    }
    return String(item);
  }

  getOptionValue(item: any): any {
    if (item && typeof item === 'object') {
      // If bindValue is provided, return that property, else return whole object
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
      // Focus search input after animation frame
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
    this.searchQuery.set(''); // Reset search
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
  }

  // Close on Click Outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }

  // --- CVA BOILERPLATE ---
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
