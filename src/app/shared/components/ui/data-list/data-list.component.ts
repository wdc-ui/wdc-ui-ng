import {
  Component,
  input,
  output,
  signal,
  contentChild,
  TemplateRef,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { IconComponent } from '../icon/icon.component';

// --- STYLES ---
const itemVariants = cva(
  'group relative flex w-full items-center justify-between gap-3 rounded-md border-2 border-border bg-card p-3 text-sm text-card-foreground shadow-sm transition-all hover:border-primary/50 hover:shadow-md cursor-grab active:cursor-grabbing',
  {
    variants: {
      dragging: {
        true: 'opacity-50 border-dashed border-primary bg-accent/50',
        false: 'opacity-100',
      },
      dragOver: {
        true: 'border-primary ring-2 ring-primary/20 scale-[1.01]',
        false: '',
      },
    },
    defaultVariants: {
      dragging: false,
      dragOver: false,
    },
  },
);

@Component({
  selector: 'wdc-data-list',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex flex-col space-y-2 w-full" role="list">
      @if (items().length === 0) {
        <div
          class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted py-8 text-center text-muted-foreground"
        >
          <wdc-icon name="list" size="32" class="mb-2 opacity-50" />
          <p class="text-sm font-medium">No items to display</p>
        </div>
      }

      @for (item of items(); track item[key()] || $index) {
        <div
          draggable="true"
          role="listitem"
          [class]="getItemClass($index)"
          (dragstart)="onDragStart($event, $index)"
          (dragover)="onDragOver($event, $index)"
          (dragleave)="onDragLeave($event, $index)"
          (drop)="onDrop($event, $index)"
          (dragend)="onDragEnd($event)"
        >
          <div
            class="text-muted-foreground/50 group-hover:text-primary cursor-grab active:cursor-grabbing shrink-0"
          >
            <wdc-icon name="drag_indicator" size="18" />
          </div>

          <div class="flex-1 truncate">
            <ng-container
              *ngTemplateOutlet="
                itemTemplate() || defaultTemplate;
                context: { $implicit: item, index: $index }
              "
            ></ng-container>
          </div>
        </div>
      }
    </div>

    <ng-template #defaultTemplate let-item>
      <span>{{ item.label || item.name || item }}</span>
    </ng-template>
  `,
})
export class DataListComponent {
  // --- INPUTS ---
  items = input.required<any[]>();
  key = input<string>('id'); // Unique ID field for tracking

  // Custom Template for Row Content
  itemTemplate = contentChild<TemplateRef<any>>('itemTemplate');

  // --- OUTPUTS ---
  reorder = output<any[]>();

  // --- STATE ---
  draggedIndex = signal<number | null>(null);
  dragOverIndex = signal<number | null>(null);

  // --- HELPERS ---
  getItemClass(index: number) {
    return cn(
      itemVariants({
        dragging: this.draggedIndex() === index,
        dragOver: this.dragOverIndex() === index && this.draggedIndex() !== index,
      }),
    );
  }

  // --- DRAG EVENTS ---

  onDragStart(event: DragEvent, index: number) {
    this.draggedIndex.set(index);
    // Required for Firefox to allow drag
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
    }
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault(); // Necessary to allow dropping
    if (this.draggedIndex() === index) return;

    this.dragOverIndex.set(index);
  }

  onDragLeave(event: DragEvent, index: number) {
    // Only reset if we are actually leaving the element
    if (this.dragOverIndex() === index) {
      this.dragOverIndex.set(null);
    }
  }

  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    const startIndex = this.draggedIndex();

    if (startIndex !== null && startIndex !== dropIndex) {
      this.reorderItems(startIndex, dropIndex);
    }

    this.resetDragState();
  }

  onDragEnd(event: DragEvent) {
    this.resetDragState();
  }

  // --- LOGIC ---

  private reorderItems(fromIndex: number, toIndex: number) {
    const currentItems = [...this.items()];
    const [movedItem] = currentItems.splice(fromIndex, 1);
    currentItems.splice(toIndex, 0, movedItem);

    // Emit the new sorted array
    this.reorder.emit(currentItems);
  }

  private resetDragState() {
    this.draggedIndex.set(null);
    this.dragOverIndex.set(null);
  }
}
