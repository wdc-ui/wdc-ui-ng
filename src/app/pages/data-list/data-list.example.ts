import { Component } from '@angular/core';
import { dedent } from '@shared/utils/dedent';
import { DataListComponent } from '@wdc-ui/ng/data-list/data-list.component';

@Component({
  selector: 'wdc-data-list-example',
  imports: [DataListComponent],
  templateUrl: './data-list.example.html',
  styleUrl: './data-list.example.css',
})
export class DataListExample {
  tasks = [
    { id: 1, title: 'Fix Login Bug', status: 'pending', date: '2h ago' },
    { id: 2, title: 'Update Documentation', status: 'done', date: '5h ago' },
    { id: 3, title: 'Design Review', status: 'pending', date: '1d ago' },
    { id: 4, title: 'Deploy to Production', status: 'pending', date: '2d ago' },
  ];

  simpleList = ['Frontend Architecture', 'Backend API', 'Database Schema', 'DevOps Pipeline'];

  // --- 2. LOGIC (For the Live Preview) ---
  onReorder(newOrder: any[]) {
    this.tasks = newOrder;
    console.log('New Order:', this.tasks);
  }

  snippets = {
    basic: {
      html: dedent(`
      <div class="w-full max-w-md">
        <wdc-data-list 
          [items]="tasks" 
          key="id"
          (reorder)="onReorder($event)"
        >
           <ng-template #itemTemplate let-task>
             <div class="flex items-center gap-2">
               <div 
                 class="h-2 w-2 rounded-full" 
                 [class.bg-success]="task.status === 'done'"
                 [class.bg-warning]="task.status === 'pending'"
               ></div>
               
               <span class="font-medium">{{ task.title }}</span>
               <span class="ml-auto text-xs text-muted-foreground">{{ task.date }}</span>
             </div>
           </ng-template>
        </wdc-data-list>
      </div>
    `),
    },
  };
}
