import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component'; // Ensure path is correct
import { cn } from '@shared/utils/cn';

// --- INTERFACE ---
export interface BreadcrumbItem {
  label: string;
  url?: string; // If missing, it's considered the active/last item
}

// --- 1. SEPARATOR (Chevron) ---
@Component({
  selector: 'wdc-breadcrumb-separator',
  standalone: true,
  imports: [IconComponent],
  template: `
    <li role="presentation" aria-hidden="true" class="[&>svg]:size-3.5">
      <ng-content>
        <wdc-icon name="chevron_right" size="16" class="text-muted-foreground/60" />
      </ng-content>
    </li>
  `,
})
export class BreadcrumbSeparatorComponent {}

// --- 2. ITEM (Link or Text) ---
@Component({
  selector: 'wdc-breadcrumb-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <li class="inline-flex items-center gap-1.5">
      @if (url()) {
        <a [routerLink]="url()" class="transition-colors text-foreground">
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </a>
      } @else {
        <span
          role="link"
          aria-disabled="true"
          aria-current="page"
          class="font-normal text-muted-foreground"
        >
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </span>
      }

      <ng-template #contentTpl>
        <span class="flex items-center gap-2">
          <ng-content></ng-content>
        </span>
      </ng-template>
    </li>
  `,
})
export class BreadcrumbItemComponent {
  url = input<string | undefined>(undefined);
}

// --- 3. CONTAINER (Main) ---
@Component({
  selector: 'wdc-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbItemComponent, BreadcrumbSeparatorComponent],
  template: `
    <nav aria-label="breadcrumb" [class]="computedClass()">
      <ol
        class="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5"
      >
        <ng-content></ng-content>

        @for (item of items(); track $index; let last = $last) {
          <wdc-breadcrumb-item [url]="item.url">
            {{ item.label }}
          </wdc-breadcrumb-item>

          @if (!last) {
            <wdc-breadcrumb-separator />
          }
        }
      </ol>
    </nav>
  `,
})
export class BreadcrumbComponent {
  // Optional: Pass data array
  items = input<BreadcrumbItem[]>([]);

  class = input('');
  computedClass = computed(() => cn('w-full', this.class()));
}

// Export array for easy imports
export const BREADCRUMB_COMPONENTS = [
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbSeparatorComponent,
] as const;
