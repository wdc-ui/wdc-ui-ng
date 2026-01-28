import { Component, computed, input } from '@angular/core';
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
    // Added 'border border-border' for the outline
    cn(
      'rounded-xl border border-border bg-card text-card-foreground shadow-sm flex flex-col',
      this.class(),
    ),
  );
}

// 2. CARD HEADER
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
  computedClass = computed(() => cn('flex flex-col space-y-1.5 p-6', this.class()));
}

// 3. CARD TITLE (Semantic H3)
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
  computedClass = computed(() => cn('font-semibold leading-none tracking-tight', this.class()));
}

// 4. CARD DESCRIPTION
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

// 5. CARD CONTENT
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
  computedClass = computed(() => cn('p-6 pt-0', this.class()));
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
  computedClass = computed(() => cn('flex items-center p-6 pt-0', this.class()));
}

// EXPORT ARRAY
export const CARD_COMPONENTS = [
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
] as const;
