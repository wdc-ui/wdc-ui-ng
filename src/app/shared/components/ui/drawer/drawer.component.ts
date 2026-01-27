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
} from '@angular/core';
import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn'; // Check path

// --- 1. NATIVE TAILWIND V4 ANIMATIONS ---
// No plugins required. We toggle translate/opacity based on data-state.
const drawerVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:translate-y-full data-[state=open]:translate-y-0',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=closed]:translate-x-full data-[state=open]:translate-x-0',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

export type DrawerProps = VariantProps<typeof drawerVariants>;

@Component({
  selector: 'wdc-drawer',
  standalone: true,
  imports: [DialogModule, CommonModule],
  template: `
    <ng-template #drawerTemplate>
      <div
        (click)="close()"
        class="fixed inset-0 z-50 bg-black/80 cursor-pointer transition-opacity duration-300 ease-in-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
        [attr.data-state]="animationState()"
      ></div>

      <div [class]="computedClasses()" [attr.data-state]="animationState()">
        <button
          (click)="close()"
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span class="sr-only">Close</span>
        </button>

        <div class="flex flex-col h-full pointer-events-auto">
          <ng-content></ng-content>
        </div>
      </div>
    </ng-template>
  `,
})
export class DrawerComponent {
  private dialog = inject(Dialog);
  private dialogRef?: DialogRef;

  open = input<boolean>(false);
  side = input<DrawerProps['side']>('right');
  openChange = output<boolean>();

  @ViewChild('drawerTemplate') template!: TemplateRef<any>;

  // Internal state for animation ('open' | 'closed')
  animationState = signal<'open' | 'closed'>('closed');

  computedClasses = computed(() => {
    return cn(drawerVariants({ side: this.side() }));
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        this.openDialog();
      } else {
        this.startExitAnimation();
      }
    });
  }

  private openDialog() {
    if (this.dialogRef) return;

    // 1. Start with CLOSED state (So it renders off-screen first)
    this.animationState.set('closed');

    // 2. Insert into DOM
    this.dialogRef = this.dialog.open(this.template, {
      panelClass: ['bg-transparent', 'border-none', 'shadow-none', 'max-w-none', 'max-h-none'],
      backdropClass: 'bg-transparent',
      disableClose: true,
    });

    // 3. Trigger Animation after a tiny delay
    // (Double requestAnimationFrame ensures the browser paints the 'closed' state first)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.animationState.set('open');
      });
    });

    // Handle Escape
    // this.dialogRef.keydownEvents$.subscribe((event) => {
    //   if (event.key === 'Escape') {
    //     this.close();
    //   }
    // });
  }

  private startExitAnimation() {
    if (!this.dialogRef) return;

    // 1. Trigger exit animation (slide out / fade out)
    this.animationState.set('closed');

    // 2. Wait 300ms for animation to finish, then destroy dialog
    setTimeout(() => {
      this.dialogRef?.close();
      this.dialogRef = undefined;
    }, 300);
  }

  close() {
    this.openChange.emit(false);
  }
}

// --- SUB COMPONENTS (UNCHANGED) ---
@Component({
  selector: 'wdc-drawer-header',
  standalone: true,
  template: `<div [class]="computedClass()"><ng-content></ng-content></div>`,
})
export class DrawerHeaderComponent {
  class = input('');
  computedClass = computed(() =>
    cn('flex flex-col space-y-2 text-center sm:text-left mb-6', this.class()),
  );
}

@Component({
  selector: 'wdc-drawer-footer',
  standalone: true,
  template: `<div [class]="computedClass()"><ng-content></ng-content></div>`,
})
export class DrawerFooterComponent {
  class = input('');
  computedClass = computed(() =>
    cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-auto pt-6', this.class()),
  );
}

@Component({
  selector: 'wdc-drawer-title',
  standalone: true,
  template: `<h2 [class]="computedClass()"><ng-content></ng-content></h2>`,
})
export class DrawerTitleComponent {
  class = input('');
  computedClass = computed(() => cn('text-lg font-semibold text-foreground', this.class()));
}

@Component({
  selector: 'wdc-drawer-description',
  standalone: true,
  template: `<p [class]="computedClass()"><ng-content></ng-content></p>`,
})
export class DrawerDescriptionComponent {
  class = input('');
  computedClass = computed(() => cn('text-sm text-muted-foreground', this.class()));
}

export const DRAWER_COMPONENTS = [
  DrawerComponent,
  DrawerHeaderComponent,
  DrawerFooterComponent,
  DrawerTitleComponent,
  DrawerDescriptionComponent,
] as const;
