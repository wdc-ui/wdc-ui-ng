import {
  Component,
  input,
  signal,
  computed,
  inject,
  HostListener,
  ElementRef,
  contentChildren,
  Directive,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

// --- 1. NAV LINK (Individual Items) ---
@Component({
  selector: 'wdc-nav-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a
      [routerLink]="href()"
      [routerLinkActive]="activeClass()"
      [routerLinkActiveOptions]="{ exact: exact() }"
      class="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-accent/50 data-[state=open]:bg-accent/50"
      [class]="class()"
    >
      @if (icon()) {
        <span class="mr-2 text-lg">{{ icon() }}</span>
      }
      <ng-content></ng-content>
    </a>
  `,
})
export class NavLinkComponent {
  href = input<string>('/');
  exact = input(false);
  icon = input<string | null>(null);
  class = input('');
  // Class to apply when active (defaults to shadcn-like accent)
  activeClass = input('bg-accent/50 text-accent-foreground font-semibold');
}

// --- 2. NAV GROUP (Dropdown / Sub-menu) ---
@Component({
  selector: 'wdc-nav-group',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="relative" (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
      <button
        type="button"
        class="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
        [class.bg-accent]="isOpen()"
        (click)="toggle()"
      >
        <span>{{ label() }}</span>
        <wdc-icon
          name="keyboard_arrow_down"
          size="16"
          class="ml-1 transition-transform duration-200"
          [class.rotate-180]="isOpen()"
        />
      </button>

      @if (isOpen()) {
        <div
          class="absolute left-0 top-full z-50 mt-2 w-48 origin-top-left rounded-md border bg-popover p-2 text-popover-foreground shadow-md animate-in fade-in zoom-in-95"
        >
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
})
export class NavGroupComponent {
  label = input.required<string>();
  triggerType = input<'hover' | 'click'>('hover');

  isOpen = signal(false);
  private timeoutId: any;

  toggle() {
    this.isOpen.update((v) => !v);
  }

  onMouseEnter() {
    if (this.triggerType() === 'hover') {
      clearTimeout(this.timeoutId);
      this.isOpen.set(true);
    }
  }

  onMouseLeave() {
    if (this.triggerType() === 'hover') {
      // Small delay to prevent flickering
      this.timeoutId = setTimeout(() => this.isOpen.set(false), 150);
    }
  }
}

// --- 3. HELPER COMPONENTS ---
@Component({
  selector: 'wdc-nav-brand',
  standalone: true,
  template: `<div class="mr-6 flex items-center space-x-2 font-bold text-xl">
    <ng-content></ng-content>
  </div>`,
})
export class NavBrandComponent {}

@Component({
  selector: 'wdc-nav-actions',
  standalone: true,
  template: `<div class="ml-auto flex items-center space-x-4"><ng-content></ng-content></div>`,
})
export class NavActionsComponent {}

// --- 4. MAIN NAVBAR ---
const navbarVariants = cva(
  'w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
  {
    variants: {
      sticky: {
        true: 'sticky top-0 z-50',
        false: 'relative',
      },
      variant: {
        default: 'border-border',
        transparent: 'bg-transparent border-transparent', // Becomes solid on scroll
        floating: 'mt-4 mx-auto max-w-5xl rounded-full border shadow-md top-4', // Modern look
      },
    },
    defaultVariants: {
      sticky: true,
      variant: 'default',
    },
  },
);

@Component({
  selector: 'wdc-navbar',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <header [class]="computedClass()">
      <div class="container flex h-14 items-center px-4 md:px-8">
        <button class="mr-2 md:hidden" (click)="toggleMobile()">
          <wdc-icon name="menu" size="24" />
        </button>

        <ng-content select="wdc-nav-brand"></ng-content>

        <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
          <ng-content select="[wdcNavLinks]"></ng-content>
        </nav>

        <ng-content select="wdc-nav-actions"></ng-content>
      </div>

      @if (isMobileOpen()) {
        <div class="md:hidden border-t p-4 bg-background animate-in slide-in-from-top-5">
          <nav class="flex flex-col space-y-4">
            <ng-content select="[wdcMobileLinks]"></ng-content>
          </nav>
        </div>
      }
    </header>
  `,
})
export class NavbarComponent {
  sticky = input(true);
  variant = input<'default' | 'transparent' | 'floating'>('default');
  class = input('');

  isMobileOpen = signal(false);
  isScrolled = signal(false);

  computedClass = computed(() => {
    // If transparent variant is used, switch to default style on scroll
    const variantStyle =
      this.variant() === 'transparent' && this.isScrolled() ? 'default' : this.variant();

    return cn(
      navbarVariants({ sticky: this.sticky(), variant: variantStyle as any }),
      this.isScrolled() && this.variant() === 'transparent'
        ? 'bg-background/95 border-b border-border shadow-sm'
        : '',
      this.class(),
    );
  });

  toggleMobile() {
    this.isMobileOpen.update((v) => !v);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }
}

export const NAVBAR_COMPONENTS = [
  NavbarComponent,
  NavLinkComponent,
  NavGroupComponent,
  NavBrandComponent,
  NavActionsComponent,
] as const;
