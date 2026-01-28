import { Component, input, computed, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { cn } from '@shared/utils/cn';

// --- INTERFACES ---
export interface BreadcrumbItem {
  label: string;
  url?: string;
}

// --- 1. SEPARATOR (Customizable) ---
@Component({
  selector: 'wdc-breadcrumb-separator',
  standalone: true,
  template: `
    <li role="presentation" aria-hidden="true" [class]="classes()">
      <ng-content>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </ng-content>
    </li>
  `,
})
export class BreadcrumbSeparatorComponent {
  class = input<string>('');
  classes = computed(() => cn('[&>svg]:size-3.5 text-muted-foreground/60', this.class()));
}

// --- 2. ITEM (Link or Current Page) ---
@Component({
  selector: 'wdc-breadcrumb-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <li class="inline-flex items-center gap-1.5">
      @if (url()) {
        <a
          [routerLink]="url()"
          [target]="target()"
          class="transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </a>
      } @else {
        <span
          role="link"
          aria-disabled="true"
          aria-current="page"
          class="font-normal text-foreground flex items-center gap-2"
        >
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </span>
      }

      <ng-template #contentTpl>
        <ng-content></ng-content>
      </ng-template>
    </li>
  `,
})
export class BreadcrumbItemComponent {
  url = input<string | undefined>(undefined);
  target = input<string>('_self');
}

// --- 3. CONTAINER (Main) ---
@Component({
  selector: 'wdc-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbItemComponent, BreadcrumbSeparatorComponent],
  template: `
    <nav aria-label="breadcrumb" [class]="computedClass()">
      <ol class="flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5">
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
  items = input<BreadcrumbItem[]>([]);
  class = input('');

  computedClass = computed(() => cn('w-full', this.class()));
}

export const BREADCRUMB_COMPONENTS = [
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbSeparatorComponent,
] as const;
