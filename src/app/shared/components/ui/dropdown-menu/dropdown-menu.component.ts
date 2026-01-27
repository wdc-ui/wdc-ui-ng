import {
  Component,
  input,
  signal,
  computed,
  inject,
  ElementRef,
  HostListener,
  Directive,
  InjectionToken,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../icon/icon.component';

// --- DI TOKEN (To share state between components) ---
export const DROPDOWN_TOKEN = new InjectionToken<DropdownComponent>('DROPDOWN_TOKEN');

// 1. DROPDOWN CONTAINER (Root)
@Component({
  selector: 'wdc-dropdown',
  standalone: true,
  providers: [{ provide: DROPDOWN_TOKEN, useExisting: DropdownComponent }],
  template: `
    <div class="relative inline-block text-left" [class]="class()">
      <ng-content></ng-content>
    </div>
  `,
})
export class DropdownComponent {
  class = input('');

  // State
  isOpen = signal(false);

  private elementRef = inject(ElementRef);

  toggle() {
    this.isOpen.update((v) => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  // Click Outside Listener
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  // Close on Escape
  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}

// 2. TRIGGER DIRECTIVE (Button/Icon/Avatar)
@Directive({
  selector: '[wdcDropdownTrigger]',
  standalone: true,
  host: {
    '(click)': 'dropdown.toggle()',
    '[attr.aria-expanded]': 'dropdown.isOpen()',
    'aria-haspopup': 'true',
    class: 'cursor-pointer',
  },
})
export class DropdownTriggerDirective {
  dropdown = inject(DROPDOWN_TOKEN);
}

// 3. CONTENT (The Menu)
@Component({
  selector: 'wdc-dropdown-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (dropdown.isOpen()) {
      <div
        [class]="computedClass()"
        (click)="handleContentClick()"
        class="absolute right-0 z-50 mt-2 min-w-[8rem] origin-top-right overflow-hidden rounded-md bg-popover p-1 text-popover-foreground shadow animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
      >
        <ng-content></ng-content>
      </div>
    }
  `,
})
export class DropdownContentComponent {
  dropdown = inject(DROPDOWN_TOKEN);

  class = input('');
  align = input<'start' | 'end' | 'center'>('end'); // Alignment relative to trigger
  closeOnSelect = input(true); // Should menu close when an item is clicked?

  computedClass = computed(() =>
    cn(
      // Positioning logic could be enhanced with Floating UI later,
      // for now simple absolute positioning works for most cases.
      this.align() === 'end'
        ? 'right-0'
        : this.align() === 'start'
          ? 'left-0'
          : 'left-1/2 -translate-x-1/2',
      this.class(),
    ),
  );

  handleContentClick() {
    // Note: We handle item clicks via bubbling or specific item logic
  }
}

// 4. ITEM (Action)
@Component({
  selector: 'wdc-dropdown-item',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div [class]="computedClass()" (click)="handleClick($event)" [attr.data-disabled]="disabled()">
      @if (icon()) {
        <wdc-icon [name]="icon()!" size="16" class="mr-2 opacity-70" />
      }

      <ng-content></ng-content>

      @if (shortcut()) {
        <span class="ml-auto text-xs tracking-widest opacity-60">{{ shortcut() }}</span>
      }
    </div>
  `,
})
export class DropdownItemComponent {
  dropdown = inject(DROPDOWN_TOKEN);
  content = inject(DropdownContentComponent, { optional: true });

  disabled = input(false);
  icon = input<string | null>(null);
  shortcut = input<string | null>(null);
  class = input('');

  // Styling: Matching Shadcn/Tailwind UI patterns
  computedClass = computed(() =>
    cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      this.class(),
    ),
  );

  handleClick(e: Event) {
    if (this.disabled()) {
      e.stopPropagation();
      return;
    }

    // Close menu if configured
    if (this.content?.closeOnSelect()) {
      this.dropdown.close();
    }
  }
}

// 5. LABEL (Header)
@Component({
  selector: 'wdc-dropdown-label',
  standalone: true,
  template: `<div [class]="computedClass()"><ng-content></ng-content></div>`,
})
export class DropdownLabelComponent {
  class = input('');
  computedClass = computed(() => cn('px-2 py-1.5 text-sm font-semibold', this.class()));
}

// 6. SEPARATOR
@Component({
  selector: 'wdc-dropdown-separator',
  standalone: true,
  template: `<div [class]="computedClass()"></div>`,
})
export class DropdownSeparatorComponent {
  class = input('');
  computedClass = computed(() => cn('-mx-1 my-1 h-px bg-muted', this.class()));
}

// EXPORT ARRAY
export const DROPDOWN_MENU_COMPONENTS = [
  DropdownComponent,
  DropdownTriggerDirective,
  DropdownContentComponent,
  DropdownItemComponent,
  DropdownLabelComponent,
  DropdownSeparatorComponent,
] as const;
