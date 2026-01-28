import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { DocsLayout } from '@shared/layouts/docs-layout/docs-layout';
import { AppLayout } from '@shared/layouts/app-layout/app-layout';
import { AdminLayout } from './shared/layouts/admin/admin.layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [{ path: '', component: HomePage }],
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: 'category',
        loadComponent: () =>
          import('./pages/category/category-list.component').then((m) => m.CategoryListComponent),
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./pages/gallery-demo/gallery-demo.component').then((m) => m.GalleryDemoComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./pages/calendar-demo/calendar-demo.component').then(
            (m) => m.CalendarDemoComponent,
          ),
      },
      {
        path: 'overlay',
        loadComponent: () =>
          import('./pages/overlay-demo/overlay-demo.component').then((m) => m.OverlayDemoComponent),
      },
    ],
  },
  {
    path: 'navbar-demo',
    loadComponent: () =>
      import('./pages/navbar-demo/navbar-demo.page').then((m) => m.NavbarDemoPage),
  },
  {
    path: 'chart-demo',
    loadComponent: () =>
      import('./pages/chart-demo/chart-demo.component').then((m) => m.ChartDemoComponent),
  },
  {
    path: 'docs',
    component: DocsLayout,
    children: [
      { path: '', redirectTo: 'introduction', pathMatch: 'full' },
      {
        path: 'introduction',
        loadComponent: () =>
          import('./pages/introduction/introduction.component').then(
            (m) => m.IntroductionComponent,
          ),
      },
      {
        path: 'breadcrumb',
        loadComponent: () =>
          import('./pages/examples/breadcrumb-example/breadcrumb-example').then(
            (m) => m.BreadcrumbExample,
          ),
      },
      {
        path: 'buttons',
        loadComponent: () =>
          import('./pages/examples/button-example/button-example').then((m) => m.ButtonExample),
      },
      {
        path: 'badges',
        loadComponent: () =>
          import('./pages/examples/badge-example/badge-example').then((m) => m.BadgeExample),
      },
      {
        path: 'cards',
        loadComponent: () =>
          import('./pages/examples/card-example/card-example').then((m) => m.CardExample),
      },
      {
        path: 'drawer',
        loadComponent: () =>
          import('./pages/examples/drawer-example/drawer-example').then((m) => m.DrawerExample),
      },
      {
        path: 'avatars',
        loadComponent: () =>
          import('./pages/examples/avatar-example/avatar-example').then((m) => m.AvatarExample),
      },
      {
        path: 'accordion',
        loadComponent: () =>
          import('./pages/examples/accordion-example/accordion-example').then(
            (m) => m.AccordionExample,
          ),
      },
      {
        path: 'toast',
        loadComponent: () =>
          import('./pages/examples/toast-example/toast-example').then((m) => m.ToastExample),
      },
      {
        path: 'modal',
        loadComponent: () =>
          import('./pages/examples/modal-example/modal-example').then((m) => m.ModalExample),
      },
      {
        path: 'tabs',
        loadComponent: () =>
          import('./pages/examples/tabs-example/tabs-example').then((m) => m.TabsExample),
      },
      {
        path: 'spinner',
        loadComponent: () =>
          import('./pages/examples/spinner-example/spinner-example').then((m) => m.SpinnerExample),
      },
      {
        path: 'text-input',
        loadComponent: () =>
          import('./pages/examples/forms/text-input-example/text-input-example').then(
            (m) => m.TextInputExample,
          ),
      },
      {
        path: 'checkbox-input',
        loadComponent: () =>
          import('./pages/examples/forms/checkbox-input-example/checkbox-input-example').then(
            (m) => m.CheckboxInputExample,
          ),
      },
      {
        path: 'radio-input',
        loadComponent: () =>
          import('./pages/examples/forms/radio-input-example/radio-input-example').then(
            (m) => m.RadioInputExample,
          ),
      },
      {
        path: 'date-picker',
        loadComponent: () =>
          import('./pages/examples/forms/datepicker-example/datepicker-example').then(
            (m) => m.DatepickerExample,
          ),
      },
      {
        path: 'select-input',
        loadComponent: () =>
          import('./pages/examples/forms/select-input-example/select-input-example').then(
            (m) => m.SelectInputExample,
          ),
      },
      {
        path: 'various-input',
        loadComponent: () =>
          import('./pages/examples/forms/other-input-example/other-input-example').then(
            (m) => m.OtherInputExample,
          ),
      },
      {
        path: 'dropdown-menu',
        loadComponent: () =>
          import('./pages/examples/dropdown-example/dropdown-example').then(
            (m) => m.DropdownExample,
          ),
      },
      {
        path: 'navbar',
        loadComponent: () =>
          import('./pages/examples/navbar-example/navbar-example').then((m) => m.NavbarExample),
      },
      {
        path: 'table',
        loadComponent: () =>
          import('./pages/examples/table-example/table-example').then((m) => m.TableExample),
      },
      {
        path: 'pagination',
        loadComponent: () =>
          import('./pages/examples/pagination-example/pagination-example').then(
            (m) => m.PaginationExample,
          ),
      },
    ],
  },
];
