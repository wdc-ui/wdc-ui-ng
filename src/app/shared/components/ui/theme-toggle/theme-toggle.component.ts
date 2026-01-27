import { Component, inject, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';
import { IconComponent } from '../icon/icon.component'; // Adjust path
import { ButtonComponent } from '../button/button.component'; // Adjust path
import { cn } from '@shared/utils/cn';

@Component({
  selector: 'wdc-theme-toggle',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <wdc-button
      variant="ghost"
      size="icon"
      (click)="themeService.toggle()"
      [class]="computedClass()"
      [attr.aria-label]="'Toggle theme'"
    >
      <div class="relative h-5 w-5">
        <wdc-icon
          name="light_mode"
          size="20"
          class="absolute left-0 top-0 transition-all duration-500 ease-in-out"
          [class.rotate-0]="!isDark()"
          [class.scale-100]="!isDark()"
          [class.-rotate-90]="isDark()"
          [class.scale-0]="isDark()"
        />

        <wdc-icon
          name="dark_mode"
          size="20"
          class="absolute left-0 top-0 transition-all duration-500 ease-in-out"
          [class.rotate-90]="!isDark()"
          [class.scale-0]="!isDark()"
          [class.rotate-0]="isDark()"
          [class.scale-100]="isDark()"
        />
      </div>

      <span class="sr-only">Toggle theme</span>
    </wdc-button>
  `,
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  class = input('');

  isDark = computed(() => this.themeService.theme() === 'dark');

  computedClass = computed(() => cn('rounded-full', this.class()));
}
