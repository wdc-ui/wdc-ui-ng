import {
  Component,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  HostListener,
  signal,
  computed,
} from '@angular/core';
import { Overlay, OverlayRef, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { OVERLAY_POSITIONS, OverlayPosition } from '../../../utils/overlay.utils'; // Adjust path

// --- 1. THE TOOLTIP CONTENT COMPONENT ---
// This is the actual bubble that appears
@Component({
  selector: 'wdc-tooltip-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      [attr.data-state]="state()"
      [attr.data-side]="side()"
    >
      {{ text() }}
    </div>
  `,
})
export class TooltipContentComponent {
  text = signal('');
  state = signal<'open' | 'closed'>('open');
  side = signal<OverlayPosition>('top');
}

// --- 2. THE DIRECTIVE ---
@Directive({
  selector: '[wdcTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  // Inputs
  text = input.required<string>({ alias: 'wdcTooltip' });
  position = input<OverlayPosition>('top');

  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef);
  private overlayRef: OverlayRef | null = null;
  private tooltipRef: any = null; // Ref to the component instance
  private timer: any;

  @HostListener('mouseenter')
  show() {
    // Delay slightly to prevent flickering on fast mouse movements
    this.timer = setTimeout(() => this.attach(), 150);
  }

  @HostListener('mouseleave')
  hide() {
    clearTimeout(this.timer);
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      // 1. Trigger Exit Animation
      this.tooltipRef.instance.state.set('closed');

      // 2. Detach after animation finishes (150ms)
      setTimeout(() => {
        this.overlayRef?.detach();
      }, 150);
    }
  }

  private attach() {
    if (this.overlayRef && this.overlayRef.hasAttached()) return;

    // Create Position Strategy
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        OVERLAY_POSITIONS[this.position()], // Preferred
        OVERLAY_POSITIONS['top'], // Fallback 1
        OVERLAY_POSITIONS['bottom'], // Fallback 2
      ]);

    // Create Overlay
    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'pointer-events-none', // Tooltips shouldn't block clicks
    });

    // Attach Component
    const portal = new ComponentPortal(TooltipContentComponent);
    this.tooltipRef = this.overlayRef.attach(portal);

    // Pass Data to Component
    this.tooltipRef.instance.text.set(this.text());
    this.tooltipRef.instance.side.set(this.position());
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    this.overlayRef?.dispose();
  }
}
