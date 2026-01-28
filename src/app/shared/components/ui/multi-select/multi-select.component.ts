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

// --- STYLES (Matches Input & Select exactly) ---
const multiSelectTriggerVariants = cva(
  'flex w-full items-center justify-between rounded-md border-2 bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] h-auto',
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
            <span class="text-danger ml-0.5">*</span>
          }
        </label>
      }

      <div
        (click)="toggle()"
        [class]="computedTriggerClass()"
        [attr.aria-expanded]="isOpen()"
        class="cursor-pointer group"
        tabindex="0"
        (keydown.enter)="toggle()"
        (keydown.space)="toggle()"
      >
        <div class="flex flex-wrap gap-1.5 w-full items-center">
          @for (val of value(); track $index) {
            <span
              class="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground animate-in fade-in zoom-in-95"
              (click)="$event.stopPropagation()"
            >
              {{ getDisplayLabel(val) }}

              <button
                type="button"
                (click)="removeItem(val)"
                [disabled]="isDisabled()"
                class="ml-0.5 rounded-full outline-none hover:bg-secondary-foreground/20 focus:bg-secondary-foreground/20 cursor-pointer flex items-center justify-center"
              >
                <wdc-icon name="close" size="14" />
              </button>
            </span>
          }

          @if (value().length === 0) {
            <span class="text-muted-foreground">{{ placeholder() }}</span>
          }
        </div>

        <div class="shrink-0 ml-2 text-muted-foreground">
          <wdc-icon
            name="keyboard_arrow_down"
            size="18"
            class="transition-transform duration-200 opacity-50 group-hover:opacity-100"
            [class.rotate-180]="isOpen()"
          />
        </div>
      </div>

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
                placeholder="Search options..."
                class="flex h-4 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                (click)="$event.stopPropagation()"
              />
            </div>
          }

          <div class="max-h-60 overflow-y-auto p-1">
            @for (item of filteredOptions(); track $index) {
              <div
                (click)="toggleOption(item)"
                class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                [class.bg-accent]="isSelected(item)"
                [class.text-accent-foreground]="isSelected(item)"
              >
                <span class="truncate">{{ getOptionLabel(item) }}</span>

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
  value = signal<any[]>([]);
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

  getDisplayLabel(val: any): string {
    const found = this.options().find((opt) => {
      const optVal = this.getOptionValue(opt);
      return optVal == val;
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
      newValues = currentValues.filter((v) => v != itemVal);
    } else {
      newValues = [...currentValues, itemVal];
    }

    this.value.set(newValues);
    this.onChange(newValues);

    // Keep focus for multi-select
    if (this.searchable()) {
      this.searchInput()?.nativeElement.focus();
    }
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
