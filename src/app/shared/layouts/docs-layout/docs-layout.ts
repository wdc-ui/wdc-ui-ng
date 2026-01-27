import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Footer } from '@shared/components/footer/footer';
import { Navbar } from '@shared/components/navbar/navbar';
import { ScrollTopDirective } from '@shared/directives/scroll-to-top.directive';
import { ToasterComponent } from '@wdc-ui/ng/toast/toaster.component';
import { TocService } from 'src/app/core/services/toc.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-docs-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToasterComponent,
    Navbar,
    Footer,
    ScrollTopDirective,
  ],
  templateUrl: './docs-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsLayout {
  tocService = inject(TocService);
  sidebarOpen = signal(false);
  viewportScroller = inject(ViewportScroller);

  menuGroups = [
    {
      label: 'Getting Started',
      items: [{ label: 'Introduction', route: '/docs/introduction', exact: true }],
    },
    {
      label: 'Components',
      items: [
        { label: 'Avatars', route: '/docs/avatars', exact: false },
        { label: 'Buttons', route: '/docs/buttons', exact: false },
        { label: 'Breadcrumb', route: '/docs/breadcrumb', exact: false },
        { label: 'Badges', route: '/docs/badges', exact: false },
        { label: 'Tabs', route: '/docs/tabs', exact: false },
        { label: 'Card', route: '/docs/cards', exact: false },
        { label: 'Spinner', route: '/docs/spinner', exact: false },
        { label: 'Accordion', route: '/docs/accordion', exact: false },
        { label: 'Dropdown Menu', route: '/docs/dropdown-menu', exact: false },
        { label: 'Navbar', route: '/docs/navbar', exact: false },
      ],
    },
    {
      label: 'Forms',
      items: [
        { label: 'Text Input', route: '/docs/text-input', exact: false },
        { label: 'Checkbox Input', route: '/docs/checkbox-input', exact: false },
        { label: 'Radio Input', route: '/docs/radio-input', exact: false },
        { label: 'Select Input', route: '/docs/select-input', exact: false },
        { label: 'Various Input', route: '/docs/various-input', exact: false },
      ],
    },
    {
      label: 'Data Display',
      items: [
        { label: 'Table', route: '/docs/table', exact: false },
        { label: 'Pagination', route: '/docs/pagination', exact: false },
      ],
    },
    {
      label: 'Overlays',
      items: [
        { label: 'Toast', route: '/docs/toast', exact: false },
        { label: 'Modal', route: '/docs/modal', exact: false },
        { label: 'Sidebar', route: '/docs/sidebar', exact: false },
        { label: 'Drawer', route: '/docs/drawer', exact: false },
      ],
    },
  ];

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  // Smooth scroll handler
  scrollTo(id: string, event: Event) {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header (adjust 64px based on your header height)
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
}
