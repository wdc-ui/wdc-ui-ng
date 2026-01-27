import {
  Component,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
  TemplateRef,
  ViewContainerRef,
  HostListener,
  OnDestroy,
  viewChild, // <--- CHANGE IMPORT
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { OVERLAY_POSITIONS, OverlayPosition } from '../../../utils/overlay.utils';

// --- 1. POPOVER COMPONENT ---
@Component({
  selector: 'wdc-popover',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-template>
      <div
        class="z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-white"
        [attr.data-state]="state()"
        [attr.data-side]="side()"
      >
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class PopoverComponent {
  // FIX: Use viewChild because the <ng-template> is in our own template above
  template = viewChild.required(TemplateRef);

  state = signal<'open' | 'closed'>('open');
  side = signal<OverlayPosition>('bottom');
}

// --- 2. POPOVER TRIGGER DIRECTIVE ---
// (No changes needed here, just re-exporting for completeness)
@Directive({
  selector: '[wdcPopoverTrigger]',
  standalone: true,
})
export class PopoverTriggerDirective implements OnDestroy {
  target = input.required<PopoverComponent>({ alias: 'wdcPopoverTrigger' });
  position = input<OverlayPosition>('bottom');

  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);

  private overlayRef: OverlayRef | null = null;
  private isOpened = false;

  @HostListener('click')
  toggle() {
    this.isOpened ? this.close() : this.open();
  }

  open() {
    if (this.isOpened) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        OVERLAY_POSITIONS[this.position()],
        OVERLAY_POSITIONS['bottom'],
        OVERLAY_POSITIONS['top'],
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const portal = new TemplatePortal(
      this.target().template(), // Accessing the viewChild signal
      this.viewContainerRef,
    );
    this.overlayRef.attach(portal);

    this.target().state.set('open');
    this.target().side.set(this.position());
    this.isOpened = true;

    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  close() {
    if (!this.isOpened || !this.overlayRef) return;

    this.target().state.set('closed');

    setTimeout(() => {
      this.overlayRef?.dispose();
      this.overlayRef = null;
      this.isOpened = false;
    }, 150);
  }

  ngOnDestroy() {
    this.overlayRef?.dispose();
  }
}
