import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component'; // Ensure you have this
import { ButtonComponent } from '../button/button.component'; // Ensure you have this
import { cn } from '@shared/utils/cn';

@Component({
  selector: 'wdc-pagination',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <nav
      class="flex w-full items-center justify-between gap-2"
      aria-label="Pagination"
      [class]="class()"
    >
      <wdc-button
        variant="link"
        size="sm"
        class="gap-1 pl-2.5 sm:pl-2.5"
        [disabled]="isFirstPage()"
        (click)="onPageChange(currentPage() - 1)"
      >
        <wdc-icon name="chevron_left" size="16" />
        <!-- <span class="hidden sm:inline">Previous</span> -->
      </wdc-button>

      <div class="flex items-center gap-1">
        @for (page of pages(); track $index) {
          @if (page === DOTS) {
            <span class="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
              <wdc-icon name="more_horiz" size="16" />
            </span>
          } @else {
            <button
              type="button"
              (click)="onPageChange(page)"
              class="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              [class.bg-primary]="page === currentPage()"
              [class.text-primary-foreground]="page === currentPage()"
              [class.shadow-sm]="page === currentPage()"
              [class.hover:bg-primary]="page === currentPage()"
              [class.hover:text-primary-foreground]="page === currentPage()"
            >
              {{ page }}
            </button>
          }
        }
      </div>

      <wdc-button
        variant="link"
        size="sm"
        class="gap-1"
        [disabled]="isLastPage()"
        (click)="onPageChange(currentPage() + 1)"
      >
        <!-- <span class="hidden sm:inline">Next</span> -->
        <wdc-icon name="chevron_right" size="16" />
      </wdc-button>
    </nav>
  `,
})
export class PaginationComponent {
  DOTS = '...';

  // --- INPUTS ---
  totalItems = input.required<number>();
  itemsPerPage = input(10);
  currentPage = input(1);
  siblingCount = input(1); // Number of pages to show around current page
  class = input('');

  // --- OUTPUTS ---
  pageChange = output<number>();

  // --- COMPUTED STATE ---
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

  isFirstPage = computed(() => this.currentPage() <= 1);
  isLastPage = computed(() => this.currentPage() >= this.totalPages());

  // --- CORE LOGIC: Generate Range ---
  pages = computed(() => {
    const totalPageCount = this.totalPages();
    const current = this.currentPage();
    const siblingCount = this.siblingCount();

    // 1. If total pages are small, show all (e.g., [1, 2, 3, 4, 5])
    // Total numbers to show = siblingCount + 5 (first, last, current, 2 dots)
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return this.range(1, totalPageCount);
    }

    // 2. Calculate left and right sibling indices
    const leftSiblingIndex = Math.max(current - siblingCount, 1);
    const rightSiblingIndex = Math.min(current + siblingCount, totalPageCount);

    // 3. Determine if we need to show dots
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // CASE A: Only Right Dots (1 2 3 4 5 ... 10)
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = this.range(1, leftItemCount);
      return [...leftRange, this.DOTS, totalPageCount];
    }

    // CASE B: Only Left Dots (1 ... 6 7 8 9 10)
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = this.range(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, this.DOTS, ...rightRange];
    }

    // CASE C: Both Dots (1 ... 4 5 6 ... 10)
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = this.range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, this.DOTS, ...middleRange, this.DOTS, lastPageIndex];
    }

    return [];
  });

  // Helper to create array range [start, ..., end]
  private range(start: number, end: number) {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  }

  onPageChange(page: number | string) {
    if (page === this.DOTS) return;
    const pageNum = Number(page);

    if (pageNum >= 1 && pageNum <= this.totalPages() && pageNum !== this.currentPage()) {
      this.pageChange.emit(pageNum);
    }
  }
}
