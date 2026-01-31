import {
  Component,
  input,
  output,
  signal,
  computed,
  contentChildren,
  TemplateRef,
  Directive,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableColumn, SortEvent, TableCellContext } from './table.models';

// UI Components (Adjust paths)
import { PaginationComponent } from '../pagination/pagination.component';
import { InputComponent, InputPrefixDirective } from '../input/input.component';
import { IconComponent } from '../icon/icon.component';

// --- DIRECTIVE ---
@Directive({
  selector: '[wdcCell]',
  standalone: true,
})
export class DataTableCellDirective<T> {
  // 1. Signal Input for the column key (alias matches selector)
  columnKey = input.required<string>({ alias: 'wdcCell' });

  // 2. OPTIONAL: Helper input for Strict Type Inference
  // User isme data pass karega taaki 'let-row' ka type infer ho sake
  dataType = input<T[] | null>(null);

  constructor(public template: TemplateRef<TableCellContext<T>>) {}

  // 3. Context Guard for Strict Typing
  static ngTemplateContextGuard<TContext>(
    dir: DataTableCellDirective<TContext>,
    ctx: unknown,
  ): ctx is TableCellContext<TContext> {
    return true;
  }
}

// --- COMPONENT ---
@Component({
  selector: 'wdc-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    InputComponent,
    IconComponent,
    InputPrefixDirective,
  ],
  template: `
    <div class="w-full space-y-4">
      @if (searchable() || title()) {
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          @if (title()) {
            <h3 class="text-lg font-semibold tracking-tight text-foreground">{{ title() }}</h3>
          }

          @if (searchable()) {
            <div class="w-full sm:w-72 ml-auto">
              <wdc-input
                placeholder="Search..."
                [ngModel]="searchQuery()"
                (ngModelChange)="onSearch($event)"
                class="bg-background"
              >
                <wdc-icon prefix name="search" size="18" class="text-muted-foreground" />
              </wdc-input>
            </div>
          }
        </div>
      }

      <div class="rounded-md border border-border bg-background overflow-hidden relative shadow-sm">
        @if (loading()) {
          <div
            class="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div class="flex items-center gap-2 text-primary font-medium">Loading...</div>
          </div>
        }

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left caption-bottom">
            <thead class="bg-muted/50 border-b border-border">
              <tr>
                @for (col of columns(); track col.key) {
                  <th
                    scope="col"
                    class="h-10 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap transition-colors"
                    [class]="col.headerClass || ''"
                    [style.width]="col.width"
                    [class.cursor-pointer]="col.sortable"
                    [class.hover:text-foreground]="col.sortable"
                    (click)="handleSort(col)"
                  >
                    <div class="flex items-center gap-1.5">
                      {{ col.label }}
                      @if (col.sortable) {
                        @if (currentSort().column === col.key) {
                          <wdc-icon
                            [name]="
                              currentSort().direction === 'asc' ? 'arrow_upward' : 'arrow_downward'
                            "
                            size="14"
                            class="text-primary"
                          />
                        } @else {
                          <wdc-icon name="unfold_more" size="14" class="text-muted-foreground/50" />
                        }
                      }
                    </div>
                  </th>
                }
              </tr>
            </thead>

            <tbody class="divide-y divide-border">
              @for (row of data(); track row) {
                <tr class="hover:bg-muted/50 transition-colors data-[state=selected]:bg-muted">
                  @for (col of columns(); track col.key) {
                    <td class="p-4 align-middle" [class]="col.cellClass || ''">
                      @if (getTemplate(col.key); as tpl) {
                        <ng-container
                          *ngTemplateOutlet="tpl; context: { $implicit: row, col: col }"
                        ></ng-container>
                      } @else {
                        <span class="truncate block max-w-[300px] text-foreground">
                          {{ getCellValue(row, col.key) }}
                        </span>
                      }
                    </td>
                  }
                </tr>
              }

              @if (data().length === 0 && !loading()) {
                <tr>
                  <td
                    [attr.colspan]="columns().length"
                    class="h-24 text-center text-muted-foreground"
                  >
                    No results found.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (withPagination()) {
        <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-1">
          <div class="flex items-center gap-4 text-sm text-muted-foreground">
            <span class="whitespace-nowrap">
              Showing <span class="font-medium text-foreground">{{ startItem() }}</span> -
              <span class="font-medium text-foreground">{{ endItem() }}</span> of
              <span class="font-medium text-foreground">{{ totalItems() }}</span>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <wdc-pagination
              [totalItems]="totalItems()"
              [itemsPerPage]="limit()"
              [currentPage]="currentPage()"
              (pageChange)="pageChange.emit($event)"
            />

            <select
              [ngModel]="limit()"
              (ngModelChange)="onLimitChange($event)"
              class="h-8 w-16 rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
            >
              @for (size of pageSizes(); track size) {
                <option [value]="size">{{ size }}</option>
              }
            </select>
          </div>
        </div>
      }
    </div>
  `,
})
export class DataTableComponent<T> {
  // Inputs (Signals)
  title = input<string>('');
  data = input.required<T[]>();
  columns = input.required<TableColumn[]>();
  loading = input(false);
  searchable = input(false);
  searchQuery = signal('');

  withPagination = input(false);
  totalItems = input(0);
  limit = input(10);
  currentPage = input(1);
  pageSizes = input<number[]>([5, 10, 20, 50, 100]);

  // Outputs
  pageChange = output<number>();
  limitChange = output<number>();
  sortChange = output<SortEvent>();
  searchChange = output<string>();

  // Templates
  // Note: We use 'any' in the query because the Directive class itself is Generic <T>
  // and we can't query Generics easily. But casting inside getTemplate fixes it.
  cellTemplates = contentChildren(DataTableCellDirective);

  getTemplate(key: string): TemplateRef<TableCellContext<T>> | null {
    const directive = this.cellTemplates().find((t) => t.columnKey() === key);
    return directive ? directive.template : null;
  }

  // Computed
  startItem = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.limit() + 1;
  });

  endItem = computed(() => {
    return Math.min(this.currentPage() * this.limit(), this.totalItems());
  });

  // Logic
  currentSort = signal<SortEvent>({ column: '', direction: '' });

  // Safe Property Access (No 'any')
  getCellValue(row: T, key: string): unknown {
    return key.split('.').reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, row);
  }

  handleSort(col: TableColumn) {
    if (!col.sortable) return;
    const current = this.currentSort();
    let newDir: 'asc' | 'desc' | '' = 'asc';

    if (current.column === col.key) {
      newDir = current.direction === 'asc' ? 'desc' : '';
    }
    const event: SortEvent = { column: newDir ? col.key : '', direction: newDir };
    this.currentSort.set(event);
    this.sortChange.emit(event);
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.searchChange.emit(query);
  }

  onLimitChange(val: number | string) {
    this.limitChange.emit(Number(val));
  }
}
