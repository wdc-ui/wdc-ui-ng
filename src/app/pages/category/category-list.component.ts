import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// UI Components

// Features
import { CategoryFormComponent } from './category-form.component';
import {
  DataTableCellDirective,
  DataTableComponent,
} from '@wdc-ui/ng/data-table/data-table.component';
import {
  DrawerComponent,
  DrawerDescriptionComponent,
  DrawerHeaderComponent,
  DrawerTitleComponent,
} from '@wdc-ui/ng/drawer/drawer.component';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { TableColumn } from '@wdc-ui/ng/data-table/table.models';
import { Category } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DataTableComponent,
    DataTableCellDirective,
    DrawerComponent,
    DrawerHeaderComponent,
    DrawerTitleComponent,
    DrawerDescriptionComponent,
    CategoryFormComponent,
    ButtonComponent,
    IconComponent,
  ],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Categories</h1>
          <p class="text-muted-foreground">Manage your product categories</p>
        </div>
        <wdc-button (click)="openCreateDrawer()">
          <wdc-icon name="add" class="mr-2" />
          Add Category
        </wdc-button>
      </div>

      <wdc-data-table
        [data]="categories()"
        [columns]="columns"
        [searchable]="true"
        [withPagination]="true"
        [totalItems]="totalItems()"
        [limit]="10"
        (searchChange)="onSearch($event)"
      >
        <ng-template wdcCell="status" [dataType]="categories()" let-row>
          <span
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
            [class.bg-green-100]="row.status === 'Active'"
            [class.text-green-800]="row.status === 'Active'"
            [class.bg-gray-100]="row.status === 'Inactive'"
            [class.text-gray-800]="row.status === 'Inactive'"
          >
            {{ row.status }}
          </span>
        </ng-template>

        <ng-template wdcCell="createdAt" [dataType]="categories()" let-row>
          <span class="text-muted-foreground text-xs">
            {{ row.createdAt | date: 'mediumDate' }}
          </span>
        </ng-template>

        <ng-template wdcCell="actions" [dataType]="categories()" let-row>
          <div class="flex justify-end gap-2">
            <wdc-button variant="ghost" [icon]="true" (click)="openEditDrawer(row)">
              <wdc-icon name="edit" size="16" class="text-blue-600" />
            </wdc-button>
            <wdc-button variant="ghost" [icon]="true" (click)="deleteCategory(row)">
              <wdc-icon name="delete" size="16" class="text-red-600" />
            </wdc-button>
          </div>
        </ng-template>
      </wdc-data-table>

      <wdc-drawer [open]="isDrawerOpen()" side="right" (openChange)="isDrawerOpen.set($event)">
        <wdc-drawer-header>
          <wdc-drawer-title>
            {{ editingCategory() ? 'Edit Category' : 'New Category' }}
          </wdc-drawer-title>
          <wdc-drawer-description>
            {{
              editingCategory()
                ? 'Update existing category details.'
                : 'Add a new category to your store.'
            }}
          </wdc-drawer-description>
        </wdc-drawer-header>

        <app-category-form
          [initialData]="editingCategory()"
          (onSave)="handleSave($event)"
          (onCancel)="isDrawerOpen.set(false)"
        />
      </wdc-drawer>
    </div>
  `,
})
export class CategoryListComponent {
  // --- TABLE CONFIG ---
  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug', cellClass: 'font-mono text-xs text-muted-foreground' },
    { key: 'status', label: 'Status', width: '100px' },
    { key: 'createdAt', label: 'Created', width: '150px' },
    { key: 'actions', label: '', width: '100px' },
  ];

  // --- STATE ---
  // In real app, these come from a Service/API
  categories = signal<Category[]>([
    { id: 1, name: 'Laptops', slug: 'laptops', status: 'Active', createdAt: '2025-10-01' },
    { id: 2, name: 'Smartphones', slug: 'smartphones', status: 'Active', createdAt: '2025-10-05' },
    {
      id: 3,
      name: 'Accessories',
      slug: 'accessories',
      status: 'Inactive',
      createdAt: '2025-10-10',
    },
  ]);

  totalItems = signal(3);

  // Drawer State
  isDrawerOpen = signal(false);
  editingCategory = signal<Category | null>(null);

  // --- ACTIONS ---

  onSearch(query: string) {
    // Implement API search here
    console.log('Searching:', query);
  }

  openCreateDrawer() {
    this.editingCategory.set(null); // Clear previous data
    this.isDrawerOpen.set(true);
  }

  openEditDrawer(category: Category) {
    this.editingCategory.set(category); // Pass data to form
    this.isDrawerOpen.set(true);
  }

  handleSave(category: Category) {
    if (this.editingCategory()) {
      // UPDATE LOGIC
      this.categories.update((list) => list.map((c) => (c.id === category.id ? category : c)));
      console.log('Updated:', category);
    } else {
      // CREATE LOGIC
      const newCat = { ...category, id: Date.now(), createdAt: new Date().toISOString() };
      this.categories.update((list) => [newCat, ...list]);
      console.log('Created:', newCat);
    }

    // Close Drawer
    this.isDrawerOpen.set(false);
  }

  deleteCategory(category: Category) {
    if (confirm(`Are you sure you want to delete ${category.name}?`)) {
      this.categories.update((list) => list.filter((c) => c.id !== category.id));
    }
  }
}
