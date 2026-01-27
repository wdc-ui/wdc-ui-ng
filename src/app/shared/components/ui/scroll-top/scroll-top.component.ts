import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'wdc-scroll-top',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button
      [class.opacity-0]="!isVisible()"
      [class.pointer-events-none]="!isVisible()"
      [class.translate-y-4]="!isVisible()"
      (click)="scrollToTop()"
      class="fixed bottom-8 right-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label="Scroll to top"
    >
      <wdc-icon name="arrow_upward" size="20" />
    </button>
  `,
})
export class ScrollTopComponent {
  isVisible = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    // Show button after scrolling 300px
    this.isVisible.set(window.scrollY > 300);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
