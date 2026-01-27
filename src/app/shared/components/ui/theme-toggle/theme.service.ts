import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  // Core State
  theme = signal<Theme>('light');

  constructor() {
    // Sirf browser environment mein run karein (SSR safe)
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }

    // Effect: Jab bhi signal change ho, DOM aur Storage update karein
    effect(() => {
      const currentTheme = this.theme();
      if (isPlatformBrowser(this.platformId)) {
        this.updateDom(currentTheme);
        localStorage.setItem('wdc-theme', currentTheme);
      }
    });
  }

  toggle() {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  setTheme(newTheme: Theme) {
    this.theme.set(newTheme);
  }

  private initializeTheme() {
    // 1. Check Local Storage
    const stored = localStorage.getItem('wdc-theme') as Theme | null;

    if (stored) {
      this.theme.set(stored);
    } else {
      // 2. Check System Preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(systemDark ? 'dark' : 'light');
    }
  }

  private updateDom(theme: Theme) {
    const root = this.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
