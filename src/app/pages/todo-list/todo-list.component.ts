import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataListComponent } from '@wdc-ui/ng/data-list/data-list.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { cn } from '@shared/utils/cn';

// --- Data Interface (Flattened with level & parentId) ---
export interface Task {
  id: string;
  title: string;
  description: string | null;
  assignees: { initials: string; color: string }[];
  dueDate: string;
  priority: 'Urgent' | 'Normal' | 'Low';
  completed: boolean;
  expanded?: boolean; // For parent tasks
  parentId?: string | null;
  level: number; // 0 = root, 1 = child
  meta?: { icon: string; count: number }; // e.g., { icon: 'call', count: 3 }
  hasChildren?: boolean; // Helper to show expand icon
}

@Component({
  selector: 'wdc-todo-list',
  standalone: true,
  imports: [CommonModule, DataListComponent, IconComponent],
  template: `
    <div class="w-full rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <div
        class="flex items-center gap-4 border-b border-border bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground"
      >
        <div class="flex-[2] min-w-[200px]">Task</div>
        <div class="flex-[3] min-w-[250px] hidden md:block">Description</div>
        <div class="w-[100px]">Assignee</div>
        <div class="w-[120px]">Due Date</div>
        <div class="w-[100px]">Priority</div>
      </div>

      <wdc-data-list
        [items]="visibleTasks()"
        key="id"
        (reorder)="onReorder($event)"
        class="divide-y divide-border"
      >
        <ng-template #itemTemplate let-task>
          <div class="flex items-center gap-4 w-full px-2 py-2">
            <div
              class="flex-[2] min-w-[200px] flex items-center gap-2 overflow-hidden"
              [style.padding-left.px]="task.level * 24"
            >
              <wdc-icon
                name="drag_indicator"
                size="16"
                class="text-muted-foreground/50 cursor-grab shrink-0"
              />

              @if (task.hasChildren) {
                <button
                  (click)="toggleExpand(task.id); $event.stopPropagation()"
                  class="p-0.5 hover:bg-accent rounded shrink-0 transition-transform"
                  [class.rotate-90]="task.expanded"
                >
                  <wdc-icon name="chevron_right" size="16" />
                </button>
              } @else {
                <div class="w-5 shrink-0"></div>
              }

              <input
                type="checkbox"
                [checked]="task.completed"
                (click)="toggleComplete(task.id); $event.stopPropagation()"
                class="h-4 w-4 rounded border-input text-primary focus:ring-primary shrink-0"
              />

              <span
                class="truncate font-medium"
                [class.line-through]="task.completed"
                [class.text-muted-foreground]="task.completed"
              >
                {{ task.title }}
              </span>

              @if (task.meta) {
                <div
                  class="flex items-center gap-0.5 ml-2 rounded-full bg-accent px-1.5 py-0.5 text-xs text-muted-foreground shrink-0"
                >
                  <wdc-icon [name]="task.meta.icon" size="12" />
                  <span>{{ task.meta.count }}</span>
                </div>
              }
            </div>

            <div
              class="flex-[3] min-w-[250px] hidden md:block truncate text-sm text-muted-foreground"
            >
              {{ task.description || '-' }}
            </div>

            <div class="w-[100px] flex -space-x-2 overflow-hidden shrink-0">
              @for (user of task.assignees; track $index) {
                <div
                  class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-medium text-white"
                  [style.background-color]="user.color"
                >
                  {{ user.initials }}
                </div>
              }
            </div>

            <div class="w-[120px] text-sm shrink-0">
              {{ task.dueDate }}
            </div>

            <div class="w-[100px] shrink-0">
              <div
                class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                [ngClass]="getPriorityClass(task.priority)"
              >
                <wdc-icon name="flag" size="12" [class.fill-current]="task.priority !== 'Low'" />
                {{ task.priority }}
              </div>
            </div>
          </div>
        </ng-template>
      </wdc-data-list>

      <button
        class="flex w-full items-center gap-2 border-t border-border p-3 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
      >
        <wdc-icon name="add" size="18" />
        Add task
      </button>
    </div>
  `,
})
export class TodoListComponent {
  // --- 1. Initial Data (Flattened tree for the example) ---
  initialTasks: Task[] = [
    {
      id: 't1',
      title: 'Wireframing',
      description: null,
      assignees: [
        { initials: 'GT', color: '#6366f1' },
        { initials: 'HG', color: '#8b5cf6' },
        { initials: 'TB', color: '#64748b' },
      ],
      dueDate: 'February 12, 2024',
      priority: 'Urgent',
      completed: false,
      level: 0,
      hasChildren: true,
      expanded: true,
      meta: { icon: 'call', count: 3 },
    },
    {
      id: 't1-1',
      parentId: 't1',
      title: 'Dashboard',
      description: 'Create wireframe for Dashboard page',
      assignees: [
        { initials: 'AN', color: '#f43f5e' },
        { initials: 'HG', color: '#eab308' },
      ],
      dueDate: 'February 12, 2024',
      priority: 'Urgent',
      completed: true,
      level: 1,
    },
    {
      id: 't1-2',
      parentId: 't1',
      title: 'Analytics',
      description: 'Create wireframe for analytics page',
      assignees: [
        { initials: 'GT', color: '#6366f1' },
        { initials: 'HG', color: '#8b5cf6' },
        { initials: 'TB', color: '#64748b' },
      ],
      dueDate: 'February 12, 2024',
      priority: 'Urgent',
      completed: true,
      level: 1,
    },
    {
      id: 't1-3',
      parentId: 't1',
      title: 'Messages',
      description: 'Create wireframe for messages page',
      assignees: [
        { initials: 'AN', color: '#10b981' },
        { initials: 'HG', color: '#64748b' },
      ],
      dueDate: 'February 12, 2024',
      priority: 'Normal',
      completed: false,
      level: 1,
    },
    {
      id: 't2',
      title: 'Hi-Fi Design',
      description: 'Create hi-fi design 3 main screen',
      assignees: [
        { initials: 'NZ', color: '#9ca3af' },
        { initials: 'RW', color: '#f87171' },
        { initials: 'FC', color: '#60a5fa' },
        { initials: 'RO', color: '#c084fc' },
      ],
      dueDate: 'February 14, 2024',
      priority: 'Low',
      completed: false,
      level: 0,
      hasChildren: true,
      expanded: true,
      meta: { icon: 'call', count: 3 },
    },
    {
      id: 't2-1',
      parentId: 't2',
      title: 'Dashboard',
      description: 'Create hi-fi a design Onboarding step by step.',
      assignees: [
        { initials: 'GT', color: '#6366f1' },
        { initials: 'HG', color: '#8b5cf6' },
        { initials: 'TB', color: '#64748b' },
      ],
      dueDate: 'February 14, 2024',
      priority: 'Low',
      completed: false,
      level: 1,
      meta: { icon: 'chat_bubble', count: 2 },
    },
    {
      id: 't2-2',
      parentId: 't2',
      title: 'Analytics',
      description: 'Create hi-fi a design a login screen step by step.',
      assignees: [
        { initials: 'AN', color: '#f43f5e' },
        { initials: 'HG', color: '#eab308' },
      ],
      dueDate: 'February 14, 2024',
      priority: 'Low',
      completed: false,
      level: 1,
      meta: { icon: 'chat_bubble', count: 6 },
    },
    {
      id: 't2-3',
      parentId: 't2',
      title: 'Messages',
      description: 'Create hi-fi a design a sign up screen step by step.',
      assignees: [
        { initials: 'AN', color: '#f43f5e' },
        { initials: 'HG', color: '#eab308' },
      ],
      dueDate: 'February 14, 2024',
      priority: 'Low',
      completed: false,
      level: 1,
      meta: { icon: 'chat_bubble', count: 1 },
    },
  ];

  // --- 2. State ---
  allTasks = signal<Task[]>(this.initialTasks);

  // --- 3. Computed: Filter tasks based on parent's expanded state ---
  visibleTasks = computed(() => {
    const tasks = this.allTasks();
    const visible: Task[] = [];
    const expandedParents = new Set<string>();

    for (const task of tasks) {
      if (task.level === 0) {
        // Root task is always visible
        visible.push(task);
        if (task.expanded) expandedParents.add(task.id);
      } else if (task.parentId && expandedParents.has(task.parentId)) {
        // Child task: visible only if parent is expanded
        visible.push(task);
        if (task.expanded) expandedParents.add(task.id); // Handle deeper nesting if needed
      }
    }
    return visible;
  });

  // --- 4. Actions ---
  toggleExpand(taskId: string) {
    this.allTasks.update((tasks) =>
      tasks.map((t) => (t.id === taskId ? { ...t, expanded: !t.expanded } : t)),
    );
  }

  toggleComplete(taskId: string) {
    this.allTasks.update((tasks) =>
      tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    );
  }

  // Handle reordering from wdc-data-list
  onReorder(newVisibleOrder: Task[]) {
    // We need to sync this new order back to the master `allTasks` list.
    // A simple approach is to rebuild `allTasks` by mapping the new visible order
    // and inserting hidden items back in their relative positions.
    // For simplicity in this example, we will just update the visible items' order in the main list.

    const newAllTasks = [...this.allTasks()];
    let visibleIndex = 0;

    // Iterate through the main list, and if an item is currently visible,
    // replace it with the item that is now at that position in the newVisibleOrder.
    for (let i = 0; i < newAllTasks.length; i++) {
      const currentTask = newAllTasks[i];
      const isVisible = this.visibleTasks().some((vt) => vt.id === currentTask.id);

      if (isVisible) {
        newAllTasks[i] = newVisibleOrder[visibleIndex];
        visibleIndex++;
      }
    }

    this.allTasks.set(newAllTasks);
  }

  // --- 5. Styling Helper ---
  getPriorityClass(priority: Task['priority']) {
    switch (priority) {
      case 'Urgent':
        return 'bg-danger/10 text-danger';
      case 'Normal':
        return 'bg-success/10 text-success';
      case 'Low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  }
}
