import {
  Component,
  input,
  output,
  computed,
  ViewChild,
  TemplateRef,
  inject,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

// --- STYLES CONFIGURATION ---
// Removed 'fixed' positioning so Flexbox (CDK) can center it
const dialogVariants = cva(
  'relative z-[51] grid w-full gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in-dialog data-[state=closed]:animate-out-dialog sm:rounded-lg',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw] h-[95vh]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type DialogProps = VariantProps<typeof dialogVariants>;

// --- MAIN COMPONENT ---
@Component({
  selector: 'wdc-dialog',
  standalone: true,
  imports: [DialogModule, CommonModule, IconComponent, ButtonComponent],
  template: `
    <ng-template #dialogTemplate>
      <div
        class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in-dialog-overlay data-[state=closed]:animate-out-dialog-overlay cursor-pointer"
        [attr.data-state]="animationState()"
        (click)="backdropClose() && close()"
      ></div>

      <div
        [class]="computedClass()"
        [attr.data-state]="animationState()"
        (click)="$event.stopPropagation()"
      >
        <!-- <button
          (click)="close()"
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <wdc-icon name="close"></wdc-icon>
        </button> -->

        <wdc-button class="absolute right-2 top-2" variant="ghost" [icon]="true" (click)="close()">
          <wdc-icon name="close"></wdc-icon>
        </wdc-button>

        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class DialogComponent {
  private dialog = inject(Dialog);
  private dialogRef?: DialogRef;

  @ViewChild('dialogTemplate') template!: TemplateRef<any>;

  open = input<boolean>(false);
  size = input<DialogProps['size']>('md');
  openChange = output<boolean>();
  backdropClose = input<boolean>(false);

  // Internal signal to control CSS classes independently of the 'open' input
  animationState = signal<'open' | 'closed'>('closed');

  computedClass = computed(() => cn(dialogVariants({ size: this.size() })));

  constructor() {
    effect(() => {
      if (this.open()) {
        this.openDialog();
      } else {
        this.closeDialogWithAnimation();
      }
    });
  }

  private openDialog() {
    if (this.dialogRef) return; // Prevent duplicate

    this.animationState.set('open'); // Trigger Entrance Animation

    this.dialogRef = this.dialog.open(this.template, {
      panelClass: ['bg-transparent', 'shadow-none', 'border-none', 'p-0', 'max-w-none'],
      backdropClass: ['bg-transparent'],
      disableClose: true, // We handle closing logic manually
    });

    // Listen for Escape key
    // this.dialogRef.keydownEvents().subscribe((event: KeyboardEvent) => {
    //   if (event.key === 'Escape') {
    //     this.close();
    //   }
    // });
  }

  // --- CLOSING LOGIC WITH DELAY ---
  private closeDialogWithAnimation() {
    if (!this.dialogRef) return;

    // 1. Trigger Exit Animation via CSS
    this.animationState.set('closed');

    // 2. Wait 200ms for animation to finish, then destroy
    setTimeout(() => {
      if (this.dialogRef) {
        this.dialogRef.close();
        this.dialogRef = undefined;
      }
    }, 200);
  }

  // Called by buttons/backdrop
  close() {
    this.openChange.emit(false);
  }
}

// --- SUB COMPONENTS ---

@Component({
  selector: 'wdc-dialog-header',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `,
})
export class DialogHeaderComponent {
  class = input('');
  computedClass = computed(() =>
    cn('flex flex-col space-y-1.5 text-center sm:text-left', this.class()),
  );
}

@Component({
  selector: 'wdc-dialog-footer',
  standalone: true,
  template: `
    <div [class]="computedClass()">
      <ng-content></ng-content>
    </div>
  `,
})
export class DialogFooterComponent {
  class = input('');
  computedClass = computed(() =>
    cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', this.class()),
  );
}

@Component({
  selector: 'wdc-dialog-title',
  standalone: true,
  template: `
    <h2 [class]="computedClass()">
      <ng-content></ng-content>
    </h2>
  `,
})
export class DialogTitleComponent {
  class = input('');
  computedClass = computed(() =>
    cn('text-lg font-semibold leading-none tracking-tight', this.class()),
  );
}

@Component({
  selector: 'wdc-dialog-description',
  standalone: true,
  template: `
    <p [class]="computedClass()">
      <ng-content></ng-content>
    </p>
  `,
})
export class DialogDescriptionComponent {
  class = input('');
  computedClass = computed(() => cn('text-sm text-muted-foreground', this.class()));
}

export const DIALOG_COMPONENTS = [
  DialogComponent,
  DialogHeaderComponent,
  DialogFooterComponent,
  DialogTitleComponent,
  DialogDescriptionComponent,
] as const;
