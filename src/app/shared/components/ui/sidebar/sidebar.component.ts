import {
  Component,
  input,
  output,
  signal,
  inject,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { cn } from '@shared/utils/cn'; // Assuming you have a tailwind class merger

// --- SERVICE: To toggle sidebar on mobile ---
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class SidebarService {
  isOpen = signal(false);
  toggle() {
    this.isOpen.update((v) => !v);
  }
  close() {
    this.isOpen.set(false);
  }
}

// --- 1. LAYOUT CONTAINER ---
@Component({
  selector: 'wdc-sidebar-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (sidebarService.isOpen()) {
      <div
        class="fixed inset-0 z-40 bg-black/80 md:hidden animate-in fade-in"
        (click)="sidebarService.close()"
      ></div>
    }

    <div class="flex h-screen w-full overflow-hidden bg-muted/20">
      <ng-content select="wdc-sidebar"></ng-content>

      <main class="flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
        <ng-content></ng-content>
      </main>
    </div>
  `,
})
export class SidebarLayoutComponent {
  sidebarService = inject(SidebarService);
}

// --- 2. SIDEBAR ASIDE ---
@Component({
  selector: 'wdc-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-full flex-col border-r bg-background">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[class]': 'computedClass()',
  },
})
export class SidebarComponent {
  sidebarService = inject(SidebarService);

  computedClass = computed(() => {
    return cn(
      'fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 md:static md:translate-x-0',
      this.sidebarService.isOpen() ? 'translate-x-0' : '-translate-x-full',
    );
  });
}

// --- 3. HEADER & FOOTER ---
@Component({
  selector: 'wdc-sidebar-header',
  standalone: true,
  template: `<div class="flex h-14 items-center border-b px-6"><ng-content /></div>`,
})
export class SidebarHeaderComponent {}

@Component({
  selector: 'wdc-sidebar-footer',
  standalone: true,
  template: `<div class="mt-auto border-t p-4"><ng-content /></div>`,
})
export class SidebarFooterComponent {}

// --- 4. ITEM & GROUPS ---
@Component({
  selector: 'wdc-sidebar-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <a
      [routerLink]="href()"
      [routerLinkActive]="'bg-primary/10 text-primary font-medium'"
      [routerLinkActiveOptions]="{ exact: exact() }"
      class="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      [class]="class()"
    >
      <ng-content></ng-content>
    </a>
  `,
})
export class SidebarItemComponent {
  href = input.required<string>();
  exact = input(false);
  class = input('');
}

@Component({
  selector: 'wdc-sidebar-group-label',
  standalone: true,
  template: `<div
    class="mb-2 mt-6 px-4 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider"
  >
    <ng-content />
  </div>`,
})
export class SidebarGroupLabelComponent {}

// --- 5. TRIGGER BUTTON (Hamburger) ---
@Component({
  selector: 'wdc-sidebar-trigger',
  standalone: true,
  imports: [IconComponent],
  template: `
    <button (click)="service.toggle()" class="md:hidden mr-4 p-1 rounded-md hover:bg-muted">
      <wdc-icon name="menu" size="24" />
    </button>
  `,
})
export class SidebarTriggerComponent {
  service = inject(SidebarService);
}

// --- 6. COLLAPSIBLE MENU ---
@Component({
  selector: 'wdc-sidebar-collapsible',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div>
      <button
        (click)="toggle()"
        class="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        [class.text-foreground]="isOpen()"
      >
        <span class="flex items-center gap-3">{{ label() }}</span>
        <wdc-icon
          name="chevron_right"
          size="16"
          class="transition-transform duration-200"
          [class.rotate-90]="isOpen()"
        />
      </button>

      <div
        class="overflow-hidden transition-all duration-300 ease-in-out pl-4 space-y-1 mt-1 border-l ml-3.5"
        [style.max-height]="isOpen() ? '500px' : '0px'"
        [style.opacity]="isOpen() ? '1' : '0'"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class SidebarCollapsibleComponent {
  label = input.required<string>();
  startOpen = input(false);
  isOpen = signal(false);

  ngOnInit() {
    if (this.startOpen()) this.isOpen.set(true);
  }

  toggle() {
    this.isOpen.update((v) => !v);
  }
}

export const SIDEBAR_COMPONENTS = [
  SidebarLayoutComponent,
  SidebarComponent,
  SidebarHeaderComponent,
  SidebarFooterComponent,
  SidebarItemComponent,
  SidebarGroupLabelComponent,
  SidebarTriggerComponent,
  SidebarCollapsibleComponent,
];
