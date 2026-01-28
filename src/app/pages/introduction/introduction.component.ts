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
  /* --- COLORS MAP --- */

  /* Brand Colors */
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-tertiary: hsl(var(--tertiary));
  --color-tertiary-foreground: hsl(var(--tertiary-foreground));

  /* Specific Branding Colors (Restored) */
  --color-dark: hsl(var(--dark));
  --color-dark-foreground: hsl(var(--dark-foreground));
  --color-light: hsl(var(--light));
  --color-light-foreground: hsl(var(--light-foreground));

  /* Status Colors */
  --color-success: hsl(var(--success));
  --color-success-foreground: hsl(var(--success-foreground));
  --color-danger: hsl(var(--danger));
  --color-danger-foreground: hsl(var(--danger-foreground));
  --color-warning: hsl(var(--warning));
  --color-warning-foreground: hsl(var(--warning-foreground));
  --color-info: hsl(var(--info));
  --color-info-foreground: hsl(var(--info-foreground));

  /* Base UI Colors */
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  /* Component Specific */
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));

  --color-sidebar: hsl(var(--sidebar));
  --color-sidebar-foreground: hsl(var(--sidebar-foreground));
  --color-sidebar-accent: hsl(var(--sidebar-accent));
  --color-sidebar-accent-foreground: hsl(var(--sidebar-accent-foreground));

  /* Tabs Specific (Restored) */
  --color-tabs-indicator: hsl(var(--tabs-indicator));
  --color-tabs-inactive-fg: hsl(var(--tabs-inactive-fg));

  /* Radius */
  --radius-sm: calc(var(--radius) - 0.25rem);
  --radius-md: calc(var(--radius) - 0.125rem);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 0.25rem);
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;

  /* --- ANIMATIONS MAP --- */

  /* Accordion */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  /* Dialogs & Overlays (Restored specific names) */
  --animate-in-dialog: zoom-in-95 0.3s ease-out;
  --animate-out-dialog: zoom-out-95 0.2s ease-in;
  --animate-in-dialog-overlay: fade-in 0.3s ease-out;
  --animate-out-dialog-overlay: fade-out 0.2s ease-in;

  /* Generic Fade/Zoom */
  --animate-in: fade-in 0.2s ease-out;
  --animate-out: fade-out 0.2s ease-in;
  --animate-zoom-in-95: zoom-in-95 0.2s ease-out;
  --animate-zoom-out-95: zoom-out-95 0.2s ease-in;

  /* Toasts (Restored missing vars) */
  --animate-toast-in-right: slide-in-from-right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  --animate-toast-in-left: slide-in-from-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  --animate-toast-in-top: slide-in-from-top 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  --animate-toast-in-bottom: slide-in-from-bottom 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  --animate-toast-out: fade-out 0.2s ease-in;
}

/* =========================================
   2. LIGHT MODE VARIABLES
   ========================================= */
:root {
  --radius: 0.5rem;

  /* A. Base */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* B. Brand Colors */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;

  --secondary: 262.1 83.3% 57.8%;
  --secondary-foreground: 210 40% 98%;

  --tertiary: 171 77% 44%;
  --tertiary-foreground: 355.7 100% 97.3%;

  /* Restored Branding */
  --dark: 222.2 47.4% 11.2%;
  --dark-foreground: 210 40% 98%;

  --light: 220 14.3% 95.9%;
  --light-foreground: 220.9 39.3% 11%;

  /* C. Status Colors */
  --danger: 0 84.2% 60.2%;
  --danger-foreground: 210 40% 98%;

  --success: 142.1 70.6% 45.3%;
  --success-foreground: 355.7 100% 97.3%;

  --warning: 38 92% 50%;
  --warning-foreground: 48 96% 89%;

  --info: 199 89% 48%;
  --info-foreground: 0 0% 100%;

  /* D. UI Elements */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;

  /* E. Components */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  --sidebar: 0 0% 98%;
  --sidebar-foreground: 240 5.3% 26.1%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.9% 10%;

  /* Tabs (Restored) */
  --tabs-indicator: 221.2 83.2% 53.3%; /* Match Primary */
  --tabs-inactive-fg: 215.4 16.3% 46.9%;
}

/* =========================================
   3. DARK MODE VARIABLES
   ========================================= */
.dark {
  /* A. Base */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;

  /* B. Brand Colors */
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;

  --secondary: 263.4 70% 50.4%;
  --secondary-foreground: 210 40% 98%;

  --tertiary: 168 83.8% 78.2%;
  --tertiary-foreground: 167 95.8% 18.8%;

  /* Restored Branding (Dark Mode equivalents) */
  --dark: 210 40% 98%; /* Inverted for utility usage */
  --dark-foreground: 222.2 47.4% 11.2%;

  --light: 217.2 32.6% 17.5%;
  --light-foreground: 210 40% 98%;

  /* C. Status Colors */
  --danger: 0 62.8% 30.6%;
  --danger-foreground: 210 40% 98%;

  --success: 142.1 70.6% 45.3%;
  --success-foreground: 144.9 80.4% 10%;

  --warning: 48 96% 89%;
  --warning-foreground: 38 92% 50%;

  --info: 199 89% 48%;
  --info-foreground: 0 0% 100%;

  /* D. UI Elements */
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;

  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;

  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;

  /* E. Components */
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;

  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;

  --sidebar: 240 5.9% 10%;
  --sidebar-foreground: 240 4.8% 95.9%;
  --sidebar-accent: 240 3.7% 15.9%;
  --sidebar-accent-foreground: 240 4.8% 95.9%;

  /* Tabs */
  --tabs-indicator: 217.2 91.2% 59.8%;
  --tabs-inactive-fg: 215 20.2% 65.1%;
}

/* =========================================
   4. KEYFRAME DEFINITIONS
   ========================================= */

/* Zoom Animations */
@keyframes zoom-in-95 {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoom-out-95 {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* Fade Animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Accordion Animations */
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}

/* Slide Animations */
@keyframes slide-in-from-top {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-in-from-bottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-in-from-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-from-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* =========================================
   5. GLOBAL UTILITIES
   ========================================= */

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer utilities {
  .scrollbar-slim {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;
  }
  .scrollbar-slim::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .scrollbar-slim::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-slim::-webkit-scrollbar-thumb {
    background-color: hsl(var(--muted-foreground) / 0.3);
    border-radius: 20px;
  }
  .scrollbar-slim::-webkit-scrollbar-thumb:hover {
    background-color: hsl(var(--muted-foreground) / 0.5);
  }

  .scrollbar-hidden {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
}
`);
}
