export interface TableColumn {
  key: string; // Key to access data (e.g., 'email' or 'address.city')
  label: string; // Header text
  sortable?: boolean; // Enable sorting for this column
  width?: string; // Optional width (e.g., '100px', '20%')
  headerClass?: string; // Custom class for <th>
  cellClass?: string; // Custom class for <td>
}

export interface TableCellContext<T> {
  $implicit: T;
  col: TableColumn;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc' | '';
}

export interface RowActionEvent {
  action: string;
  row: any;
}
