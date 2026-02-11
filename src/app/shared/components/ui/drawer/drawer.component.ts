import {
  Component,
  input,
  output,
  computed,
  TemplateRef,
  ViewChild,
  inject,
  effect,
  signal,
  Renderer2,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule, DOCUMENT } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

// --- DRAWER VARIANTS ---
const drawerVariants = cva(
  'fixed z-50 flex flex-col bg-background shadow-lg transition-transform duration-300 ease-in-out',
  {
    variants: {
      side: {
        // top: 'inset-x-0 top-0 border-b data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0 max-h-[90vh]',
        // bottom:
        //   'inset-x-0 bottom-0 border-t data-[state=closed]:translate-y-full data-[state=open]:translate-y-0 max-h-[90vh]',
        left: 'inset-y-0 left-0 h-full border-r data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0',
        right:
          'inset-y-0 right-0 h-full border-l data-[state=closed]:translate-x-full data-[state=open]:translate-x-0',
      },
      size: {
        sm: 'w-full sm:max-w-xs',
        default: 'w-full sm:max-w-sm',
        md: 'w-full sm:max-w-md',
        lg: 'w-full sm:max-w-lg',
        xl: 'w-full sm:max-w-xl',
        '2xl': 'w-full sm:max-w-2xl',
        full: 'w-screen',
        auto: 'w-auto',
      },
    },
    defaultVariants: {
      side: 'right',
      size: 'default',
    },
  },
);

export type DrawerProps = VariantProps<typeof drawerVariants>;

@Component({
  selector: 'wdc-drawer',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonComponent, IconComponent],
  template: `
    <ng-template #drawerTemplate>
      <div
        (click)="backdropClose() && onBackdropClick()"
        class="fixed inset-0 z-50 bg-black/80 cursor-pointer transition-opacity duration-300 ease-in-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
        [attr.data-state]="animationState()"
      ></div>

      <div [class]="computedClasses()" [attr.data-state]="animationState()">
        @if (showCloseIcon()) {
          <wdc-button
            class="absolute right-4 top-4 z-50 opacity-70 hover:opacity-100 focus:outline-none"
            variant="ghost"
            size="sm"
            (click)="close()"
          >
            <wdc-icon name="close" size="18"></wdc-icon>
          </wdc-button>
        }

        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class DrawerComponent implements AfterViewInit {
  private dialog = inject(Dialog);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private sso = inject(ScrollStrategyOptions);
  private dialogRef?: DialogRef;

  // --- INPUTS ---
  open = input<boolean>(false);
  side = input<DrawerProps['side']>('right');
  size = input<DrawerProps['size']>('default');
  backdropClose = input<boolean>(true);
  showCloseIcon = input<boolean>(false);
  class = input<string>('');

  // --- OUTPUTS ---
  openChange = output<boolean>();

  @ViewChild('drawerTemplate') template!: TemplateRef<any>;

  animationState = signal<'open' | 'closed'>('closed');
  private viewInitialized = signal(false);

  computedClasses = computed(() => {
    return cn(drawerVariants({ side: this.side(), size: this.size() }), this.class());
  });

  constructor() {
    effect(() => {
      // Wait for view init to avoid "undefined template" errors
      if (this.viewInitialized()) {
        if (this.open()) {
          this.openDialog();
          this.lockScroll();
        } else {
          this.startExitAnimation();
          this.unlockScroll();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.viewInitialized.set(true);
  }

  // --- SCROLL LOCKING ---
  private lockScroll() {
    this.renderer.addClass(this.document.body, 'overflow-hidden');
  }

  private unlockScroll() {
    this.renderer.removeClass(this.document.body, 'overflow-hidden');
  }

  // --- DIALOG ACTIONS ---
  onBackdropClick() {
    this.close();
  }

  private openDialog() {
    if (this.dialogRef) return;
    this.animationState.set('closed');

    this.dialogRef = this.dialog.open(this.template, {
      panelClass: [
        'bg-transparent',
        'border-none',
        'shadow-none',
        'max-w-none',
        'max-h-none',
        'p-0',
        'pointer-events-none',
      ],
      backdropClass: 'bg-transparent',
      disableClose: true,
      autoFocus: false,
      scrollStrategy: this.sso.noop(),
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.animationState.set('open');
      });
    });
  }

  private startExitAnimation() {
    if (!this.dialogRef) return;
    this.animationState.set('closed');
    setTimeout(() => {
      this.dialogRef?.close();
      this.dialogRef = undefined;
    }, 300);
  }

  close() {
    this.openChange.emit(false);
  }
}

// --- SUB COMPONENTS (LAYOUT FIXED) ---

// 1. HEADER (Host Class + Shrink-0)
@Component({
  selector: 'wdc-drawer-header',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'computedClass()',
  },
})
export class DrawerHeaderComponent {
  class = input('');
  computedClass = computed(() =>
    cn('block flex flex-col space-y-1.5 p-6 border-b shrink-0 pointer-events-auto', this.class()),
  );
}

// 2. CONTENT (Host Class + Flex-1 + Min-h-0)
@Component({
  selector: 'wdc-drawer-content',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'computedClass()',
  },
})
export class DrawerContentComponent {
  class = input('');
  computedClass = computed(() =>
    // 'flex-1' is now on the HOST element, so it will actually grow inside the flex parent
    cn('block flex-1 overflow-y-auto p-6 min-h-0 pointer-events-auto', this.class()),
  );
}

// 3. FOOTER (Host Class + mt-auto + Shrink-0)
@Component({
  selector: 'wdc-drawer-footer',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'computedClass()',
  },
})
export class DrawerFooterComponent {
  class = input('');
  computedClass = computed(() =>
    // 'mt-auto' forces it to the bottom
    cn(
      'block flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t mt-auto shrink-0 pointer-events-auto',
      this.class(),
    ),
  );
}

// 4. TITLES (Text styling only)
@Component({
  selector: 'wdc-drawer-title',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'computedClass()',
  },
})
export class DrawerTitleComponent {
  class = input('');
  computedClass = computed(() =>
    cn('block text-lg font-semibold leading-none tracking-tight', this.class()),
  );
}

@Component({
  selector: 'wdc-drawer-description',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'computedClass()',
  },
})
export class DrawerDescriptionComponent {
  class = input('');
  computedClass = computed(() => cn('block text-sm text-muted-foreground', this.class()));
}

export const DRAWER_COMPONENTS = [
  DrawerComponent,
  DrawerHeaderComponent,
  DrawerContentComponent,
  DrawerFooterComponent,
  DrawerTitleComponent,
  DrawerDescriptionComponent,
] as const;
