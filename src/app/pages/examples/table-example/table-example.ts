import { Component, signal } from '@angular/core';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { TableColumn } from '@wdc-ui/ng/data-table/table.models';
import {
  DataTableCellDirective,
  DataTableComponent,
} from '@wdc-ui/ng/data-table/data-table.component';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';

interface User {
  id?: number;
  name: string;
  email?: string;
  role?: string;
  salary?: number;
  status?: 'Active' | 'Inactive' | unknown;
  lastLogin?: string;
}

@Component({
  selector: 'wdc-table-example',
  imports: [
    IconComponent,
    UiConfig,
    ButtonComponent,
    CommonModule,
    JsonPipe,
    DataTableComponent,
    DataTableCellDirective,
  ],
  templateUrl: './table-example.html',
})
export class TableExample {
  loading = signal(false);
  currentLimit = signal(10);
  currentPage = signal(1);
  // --- 1. SIMPLE DATA ---
  simpleColumns: TableColumn[] = [
    { key: 'id', label: 'ID', width: '50px' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
  ];
  simpleUsers: User[] = [
    { id: 1, name: 'John Doe', role: 'Admin' },
    { id: 2, name: 'Jane Smith', role: 'Editor' },
    { id: 3, name: 'Bob Johnson', role: 'Viewer' },
  ];

  // --- 2. PAGINATION & ACTIONS DATA ---
  page = signal(1);
  actionColumns: TableColumn[] = [
    { key: 'name', label: 'User Name' },
    { key: 'status', label: 'Status' }, // Will use custom template
    { key: 'lastLogin', label: 'Last Login' },
    {
      key: 'actions',
      label: 'Actions',
      width: '100px',
      headerClass: 'text-right',
      cellClass: 'text-right',
    },
  ];

  paginatedUsers: User[] = [
    { name: 'Kamal Singh', status: 'Active', lastLogin: '2 mins ago' },
    { name: 'Rahul Verma', status: 'Inactive', lastLogin: '2 days ago' },
    { name: 'Sneha Gupta', status: 'Active', lastLogin: '1 hour ago' },
  ];

  onPageChange(p: number) {
    this.page.set(p);
    // In real app, fetch API here
    console.log('Fetch page:', p);
  }
  onEdit(row: any) {
    alert(`Edit: ${row.name}`);
  }
  onDelete(row: any) {
    alert(`Delete: ${row.name}`);
  }

  // --- 3. FULL FEATURED DATA ---
  fullColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email Address' }, // Custom template
    { key: 'role', label: 'Role', sortable: true },
    { key: 'salary', label: 'Salary ($)', sortable: true, cellClass: 'font-mono' },
  ];

  // Mock Data
  fullData: User[] = [
    { name: 'Alice', email: 'alice@company.com', role: 'Dev', salary: 90000 },
    { name: 'Bob', email: 'bob@company.com', role: 'Design', salary: 85000 },
    { name: 'Charlie', email: 'charlie@company.com', role: 'Manager', salary: 120000 },
    { name: 'David', email: 'david@company.com', role: 'Dev', salary: 95000 },
  ];

  // Client-side filtering logic for demo
  searchQuery = signal('');
  sortEvent = signal<any>(null);

  filteredData = signal<User[]>(this.fullData);

  onSearch(q: string) {
    this.searchQuery.set(q);
    this.applyFilters();
  }

  onSort(e: any) {
    this.sortEvent.set(e);
    // Client side sort demo
    const sorted = [...this.filteredData()].sort((a: any, b: any) => {
      if (!e.direction) return 0;
      const valA = a[e.column];
      const valB = b[e.column];
      return e.direction === 'asc' ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });
    this.filteredData.set(sorted);
  }

  applyFilters() {
    const q = this.searchQuery().toLowerCase();
    const filtered = this.fullData.filter(
      (u) => u.name.toLowerCase().includes(q) || (u.email && u.email.toLowerCase().includes(q)),
    );
    this.filteredData.set(filtered);
  }

  onLimitChange(newLimit: number) {
    this.currentLimit.set(newLimit);
    this.currentPage.set(1); // Reset to first page
    // this.fetchData(); // Reload API
  }

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} data-table`),
    simple: {
      html: dedent(
        `<wdc-data-table [data]="simpleUsers" [columns]="simpleColumns"></wdc-data-table>`,
      ),
      ts: dedent(`
        import { Component } from '@angular/core';
        import { TableColumn } from '${AppSetting.libName}/data-table/table.models';
        import {
          DataTableCellDirective,
          DataTableComponent,
        } from '${AppSetting.libName}/data-table/data-table.component';
         
        interface User {
          id: number;
          name: string;
          role: string;
        }
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [TableColumn, DataTableCellDirective, DataTableComponent],
        })
        export class ExampleComponent {
            simpleColumns: TableColumn[] = [
              { key: 'id', label: 'ID', width: '50px' },
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Role' },
            ];
            simpleUsers: User[] = [
              { id: 1, name: 'John Doe', role: 'Admin' },
              { id: 2, name: 'Jane Smith', role: 'Editor' },
              { id: 3, name: 'Bob Johnson', role: 'Viewer' },
            ];
        }`),
    },
    pagination: {
      html: dedent(`<wdc-data-table
            title="Manage Users"
            [data]="paginatedUsers"
            [columns]="actionColumns"
            [withPagination]="true"
            [totalItems]="100"
            [limit]="5"
            [currentPage]="page()"
            (pageChange)="onPageChange($event)"
          >
            <ng-template wdcCell="status" let-row>
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                [class.bg-green-100]="row.status === 'Active'"
                [class.text-green-700]="row.status === 'Active'"
                [class.bg-red-100]="row.status === 'Inactive'"
                [class.text-red-700]="row.status === 'Inactive'"
              >
                {{ row.status }}
              </span>
            </ng-template>

            <ng-template wdcCell="actions" let-row>
              <div class="flex items-center gap-2">
                <wdc-button variant="ghost" size="icon" (click)="onEdit(row)">
                  <wdc-icon name="edit" size="16" class="text-blue-600" />
                </wdc-button>
                <wdc-button variant="ghost" size="icon" (click)="onDelete(row)">
                  <wdc-icon name="delete" size="16" class="text-red-600" />
                </wdc-button>
              </div>
            </ng-template>
          </wdc-data-table>`),
      ts: dedent(`
        import { Component } from '@angular/core';
        import { TableColumn } from '${AppSetting.libName}/data-table/table.models';
        import {
          DataTableCellDirective,
          DataTableComponent,
        } from '${AppSetting.libName}/data-table/data-table.component';

        interface User {
          name: string;
          status: 'Active' | 'Inactive';
          lastLogin: string;
        }

        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [TableColumn, DataTableCellDirective, DataTableComponent],
        })
        export class ExampleComponent {
          page = signal(1);
          actionColumns: TableColumn[] = [
            { key: 'name', label: 'User Name' },
            { key: 'status', label: 'Status' },
            { key: 'lastLogin', label: 'Last Login' },
            {
              key: 'actions',
              label: 'Actions',
              width: '100px',
              headerClass: 'text-right',
              cellClass: 'text-right',
            },
          ];

          paginatedUsers: User[] = [
            { name: 'Kamal Singh', status: 'Active', lastLogin: '2 mins ago' },
            { name: 'Rahul Verma', status: 'Inactive', lastLogin: '2 days ago' },
            { name: 'Sneha Gupta', status: 'Active', lastLogin: '1 hour ago' },
          ];
          onPageChange(p: number) {
            this.page.set(p);
            console.log('Fetch page:', p);
          }
          onEdit(row: any) {
            alert('Edit');
          }
          onDelete(row: any) {
            alert('Delete');
          }
        }`),
    },
    full: {
      html: dedent(`<wdc-data-table
            title="All Employees"
            [data]="filteredData()"
            [columns]="fullColumns"
            [searchable]="true"
            [loading]="loading()"
            [withPagination]="true"
            [totalItems]="filteredData().length"
            [currentPage]="currentPage()"
            (searchChange)="onSearch($event)"
            (sortChange)="onSort($event)"
            (limitChange)="onLimitChange($event)"
          >
            <ng-template wdcCell="email" let-row>
              <div class="flex items-center gap-2">
                <wdc-icon name="mail" size="14" class="text-muted-foreground" />
                <a href="mailto:{{ row.email }}" class="hover:underline">{{ row.email }}</a>
              </div>
            </ng-template>
          </wdc-data-table>`),
      ts: dedent(`
        import { Component } from '@angular/core';
        import { TableColumn } from '${AppSetting.libName}/data-table/table.models';
        import {
          DataTableCellDirective,
          DataTableComponent,
        } from '${AppSetting.libName}/data-table/data-table.component';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [TableColumn, DataTableCellDirective, DataTableComponent],
        })
        export class ExampleComponent {
          loading = signal(false);
          currentLimit = signal(10);
          currentPage = signal(1);
          fullColumns: TableColumn[] = [
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email Address' },
            { key: 'role', label: 'Role' },
            { key: 'salary', label: 'Salary ($)' },
          ];
          loading = signal(false);
          data = signal<Record<string, any>[]>([]);
          filteredData = computed(() => this.data());
          searchQuery = signal('');
          sortEvent = signal<any>(null);
          onSearch(q: string) {
            this.searchQuery.set(q);   
            this.applyFilters();         
          }
          applyFilters() {
            const q = this.searchQuery().toLowerCase();
            const filtered = this.data().filter(
              (u) => u.name.toLowerCase().includes(q) || (u.email && u.email.toLowerCase().includes(q)),
            );
            this.filteredData.set(filtered);
          }
          onSort(e: any) {
            this.sortEvent.set(e);
          }
          onLimitChange(newLimit: number) {
            this.currentLimit.set(newLimit);
            this.currentPage.set(1);
          }
        }`),
    },
  };

  references: ReferenceItem[] = [
    {
      input: 'data',
      type: 'any[]',
      default: 'required',
      description: 'Array of data objects to display in the table rows.',
    },
    {
      input: 'columns',
      type: 'TableColumn[]',
      default: 'required',
      description: 'Configuration array defining column keys, labels, widths, and sortability.',
    },
    {
      input: 'title',
      type: 'string',
      default: "''",
      description: 'Optional title displayed above the table.',
    },
    {
      input: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Shows a loading overlay/spinner on top of the table data.',
    },
    {
      input: 'searchable',
      type: 'boolean',
      default: 'false',
      description: 'Enables the search input field in the top toolbar.',
    },
    {
      input: 'withPagination',
      type: 'boolean',
      default: 'false',
      description: 'Enables the pagination footer, including page numbers and limit selector.',
    },
    {
      input: 'totalItems',
      type: 'number',
      default: '0',
      description: 'Total count of records (server-side) required for pagination logic.',
    },
    {
      input: 'limit',
      type: 'number',
      default: '10',
      description: 'Number of rows to display per page.',
    },
    {
      input: 'currentPage',
      type: 'number',
      default: '1',
      description: 'The current active page number.',
    },
    {
      input: 'pageSizes',
      type: 'number[]',
      default: '[5, 10, 20, 50, 100]',
      description: 'Array of options available in the "Rows per page" dropdown.',
    },
    // --- OUTPUTS ---
    {
      input: 'pageChange',
      type: 'Event<number>',
      default: '-',
      description: 'Emits the new page number when pagination buttons are clicked.',
    },
    {
      input: 'limitChange',
      type: 'Event<number>',
      default: '-',
      description: 'Emits the new limit when "Rows per page" is changed.',
    },
    {
      input: 'searchChange',
      type: 'Event<string>',
      default: '-',
      description: 'Emits the search query string on input change.',
    },
    {
      input: 'sortChange',
      type: 'Event<SortEvent>',
      default: '-',
      description: 'Emits column key and direction when a header is clicked.',
    },
    // --- DIRECTIVES ---
    {
      input: 'wdcCell',
      type: 'Directive',
      default: '-',
      description:
        'Structural directive to provide custom templates for specific columns (e.g. *wdcCell="status").',
    },
  ];
}
