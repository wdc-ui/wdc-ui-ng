import { Component, input, signal, computed, inject, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@shared/utils/cn';

// --- DI Token for Sharing State ---
export const TABS_CONTEXT = new InjectionToken<TabsComponent>('TABS_CONTEXT');

// 1. TABS CONTAINER
@Component({
  selector: 'wdc-tabs',
  standalone: true,
  providers: [{ provide: TABS_CONTEXT, useExisting: TabsComponent }],
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `,
})
export class TabsComponent {
  defaultValue = input.required<string>();
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  class = input('');

  activeValue = signal<string>('');

  constructor() {
    setTimeout(() => this.activeValue.set(this.defaultValue()), 0);
  }

  setActive(value: string) {
    this.activeValue.set(value);
  }

  computedClass = computed(() =>
    cn(
      'flex w-full',
      this.orientation() === 'vertical' ? 'flex-row gap-6' : 'flex-col',
      this.class(),
    ),
  );
}

// 2. TABS LIST (Buttons Container)
@Component({
  selector: 'wdc-tabs-list',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `,
})
export class TabsListComponent {
  tabs = inject(TABS_CONTEXT);
  class = input('');

  computedClass = computed(() =>
    cn(
      'inline-flex',
      this.tabs.orientation() === 'horizontal'
        ? 'w-full items-center justify-start border-b border-border'
        : 'flex-col h-fit w-auto  border-r border-border',
      this.class(),
    ),
  );
}

// 3. TABS TRIGGER (The Button)
@Component({
  selector: 'wdc-tabs-trigger',
  standalone: true,
  template: `
    <button
      (click)="tabs.setActive(value())"
      [class]="computedClass()"
      [attr.data-state]="isActive() ? 'active' : 'inactive'"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class TabsTriggerComponent {
  tabs = inject(TABS_CONTEXT);
  value = input.required<string>();
  class = input('');

  isActive = computed(() => this.tabs.activeValue() === this.value());

  computedClass = computed(() => {
    const isVertical = this.tabs.orientation() === 'vertical';
    return cn(
      'inline-flex cursor-pointer items-center justify-center whitespace-nowrap px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      'text-tabs-inactive-fg hover:text-foreground',

      isVertical
        ? 'w-full justify-start border-r-2 border-transparent data-[state=active]:border-tabs-indicator data-[state=active]:text-foreground data-[state=active]:bg-accent/20 -mr-[2px]'
        : 'border-b-2 border-transparent data-[state=active]:border-tabs-indicator data-[state=active]:text-foreground -mb-[2px]',

      this.class(),
    );
  });
}

// 4. TABS CONTENT (The Panel)
@Component({
  selector: 'wdc-tabs-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isActive()) {
      <div
        [class]="computedClass()"
        class="animate-in fade-in zoom-in-95 duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ng-content></ng-content>
      </div>
    }
  `,
})

//
export class TabsContentComponent {
  tabs = inject(TABS_CONTEXT);
  value = input.required<string>();
  class = input('');

  isActive = computed(() => this.tabs.activeValue() === this.value());
  // Added card styling to content area similar to image
  computedClass = computed(() => {
    const isVertical = this.tabs.orientation() === 'vertical';
    return cn(
      'rounded-lg bg-card text-card-foreground p-4',
      isVertical ? 'mt-0' : 'mt-2',
      this.class(),
    );
  });
}

export const TABS_COMPONENTS = [
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
] as const;
