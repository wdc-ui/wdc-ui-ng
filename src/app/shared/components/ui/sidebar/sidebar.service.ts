import { Injectable, signal, inject, effect } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private breakpointObserver = inject(BreakpointObserver);

  // State
  isMobile = signal(false);
  isOpen = signal(true); // Desktop pe default open

  constructor() {
    // Watch for Mobile Breakpoint (Tailwind 'md' is usually 768px)
    this.breakpointObserver.observe('(max-width: 768px)').subscribe((result) => {
      this.isMobile.set(result.matches);

      // Agar Mobile hai to default close, Desktop hai to default open
      if (result.matches) {
        this.isOpen.set(false);
      } else {
        this.isOpen.set(true);
      }
    });
  }

  toggle() {
    this.isOpen.update((v) => !v);
  }

  setOpen(value: boolean) {
    this.isOpen.set(value);
  }

  closeMobile() {
    if (this.isMobile()) {
      this.isOpen.set(false);
    }
  }
}
