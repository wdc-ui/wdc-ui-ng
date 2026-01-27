import { Directive, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[wdcScrollTop]',
  standalone: true,
})
export class ScrollTopDirective {
  @HostListener('click')
  onClick() {
    // 1. Try to find the scrollable main area in your layout
    const scrollContainer = document.querySelector('main.overflow-y-auto');

    if (scrollContainer) {
      // Smooth scroll for the custom container
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback to window scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
