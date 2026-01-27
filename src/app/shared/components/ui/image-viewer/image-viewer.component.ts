import {
  Component,
  input,
  output,
  signal,
  ViewChild,
  TemplateRef,
  inject,
  effect,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { IconComponent } from '../icon/icon.component'; // Ensure path is correct

@Component({
  selector: 'wdc-image-viewer',
  standalone: true,
  imports: [CommonModule, DialogModule, IconComponent],
  template: `
    <ng-template #viewerTemplate>
      <div
        class="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm transition-opacity duration-300 ease-in-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
        [attr.data-state]="animationState()"
        (click)="close()"
      ></div>

      <div
        class="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8 pointer-events-none transition-all duration-300 ease-out scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100"
        [attr.data-state]="animationState()"
        (click)="close()"
      >
        <div
          class="relative max-h-full max-w-full pointer-events-auto"
          (click)="$event.stopPropagation()"
        >
          <button
            (click)="close()"
            class="absolute -top-10 right-0 sm:-right-10 text-white/70 hover:text-white transition-colors focus:outline-none p-1 rounded-full bg-black/20 sm:bg-transparent"
            aria-label="Close viewer"
          >
            <wdc-icon name="close" size="28" />
          </button>

          @if (isLoading()) {
            <div class="absolute inset-0 flex items-center justify-center text-white">
              <wdc-icon name="progress_activity" size="40" class="animate-spin opacity-50" />
            </div>
          }

          <img
            [src]="src()"
            [alt]="alt() || 'Full screen image'"
            class="h-auto max-h-[85vh] w-auto max-w-full rounded-lg shadow-2xl object-contain transition-opacity duration-300"
            [class.opacity-0]="isLoading()"
            (load)="onImageLoad()"
          />

          @if (alt()) {
            <p class="text-center text-white/80 mt-2 text-sm">{{ alt() }}</p>
          }
        </div>
      </div>
    </ng-template>
  `,
})
export class ImageViewerComponent {
  private dialog = inject(Dialog);
  private dialogRef?: DialogRef;

  // --- INPUTS ---
  open = input<boolean>(false);
  src = input.required<string>();
  alt = input<string>('');

  // --- OUTPUTS ---
  openChange = output<boolean>();

  @ViewChild('viewerTemplate') template!: TemplateRef<any>;

  // --- STATE ---
  animationState = signal<'open' | 'closed'>('closed');
  isLoading = signal(true);

  constructor() {
    // Watch for open signal changes
    effect(() => {
      if (this.open()) {
        this.openDialog();
      } else {
        this.startExitAnimation();
      }
    });

    // Reset loading state whenever src changes while open
    effect(() => {
      this.src();
      if (this.open()) {
        this.isLoading.set(true);
      }
    });
  }

  onImageLoad() {
    this.isLoading.set(false);
  }

  private openDialog() {
    if (this.dialogRef) return;

    // 1. Start Closed
    this.animationState.set('closed');
    this.isLoading.set(true); // Reset loading on open

    this.dialogRef = this.dialog.open(this.template, {
      panelClass: ['bg-transparent', 'border-none', 'shadow-none', 'max-w-none', 'max-h-none'],
      backdropClass: 'bg-transparent',
      disableClose: true,
      autoFocus: false, // Prevents jarring focus shift on open
    });

    // 2. Trigger Animation after paint (Zero-frame fix)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.animationState.set('open');
      });
    });

    // this.dialogRef.keydownEvents$.subscribe((event) => {
    //   if (event.key === 'Escape') this.close();
    // });
  }

  private startExitAnimation() {
    if (!this.dialogRef) return;
    this.animationState.set('closed');
    // Wait for duration-300
    setTimeout(() => {
      this.dialogRef?.close();
      this.dialogRef = undefined;
    }, 300);
  }

  close() {
    this.openChange.emit(false);
  }
}
