import { Component, Input, Directive, computed, input } from '@angular/core';
import { cn } from '@shared/utils/cn';

// 1. MAIN CARD CONTAINER
@Component({
  selector: 'wdc-card',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  class = input('');
  computedClass = computed(() =>
    cn('rounded-xl bg-card text-card-foreground shadow-sm flex flex-col', this.class()),
  );
}

// 2. CARD HEADER (Padding & Layout)
@Component({
  selector: 'wdc-card-header',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardHeaderComponent {
  class = input('');
  computedClass = computed(() =>
    cn('flex flex-col border-b border-card-border px-6 py-4', this.class()),
  );
}

// 3. CARD TITLE (H3 Styling)
@Component({
  selector: 'wdc-card-title',
  standalone: true,
  template: `
    <h3 [class]="computedClass()">
      <ng-content></ng-content>
    </h3>
  `,
})
export class CardTitleComponent {
  class = input('');
  computedClass = computed(() => cn('text-lg font-bold leading-none tracking-tight', this.class()));
}

// 4. CARD DESCRIPTION/SUBTITLE
@Component({
  selector: 'wdc-card-description',
  standalone: true,
  template: `
    <p [class]="computedClass()">
      <ng-content></ng-content>
    </p>
  `,
})
export class CardDescriptionComponent {
  class = input('');
  computedClass = computed(() => cn('text-sm text-muted-foreground', this.class()));
}

// 5. CARD CONTENT/BODY
@Component({
  selector: 'wdc-card-content',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardContentComponent {
  class = input('');
  computedClass = computed(() => cn('p-6', this.class()));
}

// 6. CARD FOOTER
@Component({
  selector: 'wdc-card-footer',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardFooterComponent {
  class = input('');
  computedClass = computed(() => cn('border-t border-card-border px-6 py-4', this.class()));
}

// EXPORT ARRAY FOR EASY IMPORT
export const CARD_COMPONENTS = [
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
] as const;
