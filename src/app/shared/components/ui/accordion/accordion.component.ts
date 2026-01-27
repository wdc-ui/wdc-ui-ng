import { Component, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../icon/icon.component';

// 1. ACCORDION CONTAINER
@Component({
  selector: 'wdc-accordion',
  standalone: true,
  template: `<div [class]="computedClass()"><ng-content></ng-content></div>`,
})
export class AccordionComponent {
  class = input('');
  computedClass = computed(() => cn('flex flex-col space-y-4', this.class()));
}

// 2. ACCORDION ITEM
@Component({
  selector: 'wdc-accordion-item',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `,
})
export class AccordionItemComponent {
  class = input('');

  isOpen = signal(false);
  toggle() {
    this.isOpen.update((v) => !v);
  }

  computedClass = computed(() =>
    cn(
      'rounded-xl border border-accordion-border bg-card text-card-foreground shadow-sm overflow-hidden',
      this.class(),
    ),
  );
}

@Component({
  selector: 'wdc-accordion-trigger',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button (click)="item.toggle()" [class]="computedClass()">
      <span class="flex-1 text-left font-medium">
        <ng-content></ng-content>
      </span>

      <div
        class="shrink-0 text-muted-foreground transition-transform duration-200"
        [class]="{ 'rotate-180': item.isOpen() }"
      >
        <wdc-icon name="keyboard_arrow_down" size="24"></wdc-icon>
      </div>
    </button>
  `,
})
export class AccordionTriggerComponent {
  item = inject(AccordionItemComponent);
  class = input('');

  computedClass = computed(() =>
    cn(
      'flex cursor-pointer w-full items-center justify-between p-4 transition-all font-medium border-accordion-border',
      this.item.isOpen() ? 'border-b' : '',
      this.class(),
    ),
  );
}

// 4. ACCORDION CONTENT
@Component({
  selector: 'wdc-accordion-content',
  standalone: true,
  template: `<div
    class="grid overflow-hidden text-sm transition-all duration-300 ease-in-out"
    [class.grid-rows-[1fr]]="item.isOpen()"
    [class.grid-rows-[0fr]]="!item.isOpen()"
  >
    <div class="min-h-0">
      <div [class]="computedInnerClass()">
        <ng-content></ng-content>
      </div>
    </div>
  </div>`,
})
export class AccordionContentComponent {
  item = inject(AccordionItemComponent);
  class = input('');

  computedInnerClass = computed(() => cn('p-4', this.class()));
}

export const ACCORDION_COMPONENTS = [
  AccordionComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  AccordionContentComponent,
] as const;
