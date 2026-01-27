import { Component, inject, signal } from '@angular/core';
import { AppSetting } from '../../shared/constants/app.constant';
import { UiConfig } from '@shared/components/ui.config';
import { dedent } from '@shared/utils/dedent';
import { TocService } from 'src/app/core/services/toc.service';

@Component({
  selector: 'app-introduction',
  imports: [UiConfig],
  templateUrl: './introduction.component.html',
})
export class IntroductionComponent {
  private tocService = inject(TocService);
  AppSetting = AppSetting;

  ngOnInit() {
    // Manually define the headings for this page
    this.tocService.setToc([
      { id: 'installation', title: 'Installation', level: 'h2' },
      { id: 'configuration', title: 'Configuration', level: 'h2' },
    ]);
  }

  cssCode = dedent(`@theme {
      /* Base Colors */
      --color-primary: #4f39f6;
      --color-secondary: #64748b;
      --color-danger: #ef4444;
      --color-success: #22c55e;
      --color-warning: #f59e0b;
      --color-info: #34d399;
      --color-light: #f8fafc;
      --color-dark: #0f172a;

      /* --- Generated States (Hover/Active) --- */
      /* Primary */
      --color-primary-hover: color-mix(in srgb, var(--color-primary), black 20%);
      --color-primary-light: color-mix(in srgb, var(--color-primary), white 90%);
      --color-primary-active: color-mix(in srgb, var(--color-primary), black 30%);
      --color-on-primary: #ffffff; /* Text color on primary button */

      /* Secondary */
      --color-secondary-hover: color-mix(in srgb, var(--color-secondary), black 20%);
      --color-secondary-light: color-mix(in srgb, var(--color-secondary), white 90%);
      --color-secondary-active: color-mix(in srgb, var(--color-secondary), black 30%);
      --color-on-secondary: #ffffff;

      /* Danger */
      --color-danger-hover: color-mix(in srgb, var(--color-danger), black 20%);
      --color-danger-light: color-mix(in srgb, var(--color-danger), white 90%);
      --color-danger-active: color-mix(in srgb, var(--color-danger), black 30%);
      --color-on-danger: #ffffff;

      /* Success */
      --color-success-hover: color-mix(in srgb, var(--color-success), black 20%);
      --color-success-light: color-mix(in srgb, var(--color-success), white 90%);
      --color-success-active: color-mix(in srgb, var(--color-success), black 30%);
      --color-on-success: #ffffff;

      /* Warning */
      --color-warning-hover: color-mix(in srgb, var(--color-warning), black 20%);
      --color-warning-light: color-mix(in srgb, var(--color-warning), white 90%);
      --color-warning-active: color-mix(in srgb, var(--color-warning), black 30%);
      --color-on-warning: #0f172a;

      /* Info */
      --color-info-hover: color-mix(in srgb, var(--color-info), black 20%);
      --color-info-light: color-mix(in srgb, var(--color-info), white 90%);
      --color-info-active: color-mix(in srgb, var(--color-info), black 30%);
      --color-on-info: #0f172a;

      /* Light */
      --color-light-hover: color-mix(in srgb, var(--color-light), black 20%);
      --color-light-active: color-mix(in srgb, var(--color-light), black 30%);
      --color-on-light: #0f172a;

      /* Dark */
      --color-dark-hover: color-mix(in srgb, var(--color-dark), black 20%);
      --color-dark-light: color-mix(in srgb, var(--color-dark), white 90%);
      --color-dark-active: color-mix(in srgb, var(--color-dark), black 30%);
      --color-on-dark: #ffffff;

      /* Adjust fonts */
      --font-sans: 'Inter', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;

      --radius: 0.5rem; /* Default rounded-md value */
      --radius-sm: calc(var(--radius) - 0.25rem);
      --radius-lg: calc(var(--radius) + 0.25rem);

      --color-ring: var(--color-primary); /* Focus ring primary color ki hogi */
      --color-border: color-mix(in srgb, var(--color-dark), transparent 85%);
    }`);
}
