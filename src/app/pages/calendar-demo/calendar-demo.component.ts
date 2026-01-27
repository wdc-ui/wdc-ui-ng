import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarCellDirective, CalendarComponent } from '@wdc-ui/ng/calendar/calendar.component';
import { CalendarEvent } from '@wdc-ui/ng/calendar/calendar.models';

@Component({
  selector: 'app-calendar-demo',
  standalone: true,
  imports: [CommonModule, CalendarComponent, CalendarCellDirective, DatePipe],
  template: `
    <div class="p-8 max-w-7xl mx-auto space-y-12">
      <section class="space-y-4">
        <h2 class="text-xl font-bold">1. Picker Mode (Default)</h2>
        <div class="flex gap-8">
          <wdc-calendar (dateChange)="onDateSelect($event)" />
          <div class="p-4 bg-muted rounded h-fit">
            Selected: <span class="font-mono font-bold">{{ selected() | date: 'fullDate' }}</span>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-xl font-bold">2. Grid Mode (Custom Content)</h2>
        <p class="text-muted-foreground">
          This mode uses <code>[gridMode]="true"</code> and a custom template.
        </p>

        <wdc-calendar [gridMode]="true" [events]="myEvents" (dateChange)="onDateSelect($event)">
          <ng-template wdcCalendarCell let-date let-day="day">
            <div class="flex flex-col gap-1">
              @for (evt of day.events; track evt.title) {
                <div
                  class="text-[10px] px-1.5 py-0.5 rounded border truncate cursor-pointer transition-colors hover:opacity-80"
                  [class.bg-blue-50]="evt.color === 'blue'"
                  [class.text-blue-700]="evt.color === 'blue'"
                  [class.border-blue-200]="evt.color === 'blue'"
                  [class.bg-red-50]="evt.color === 'red'"
                  [class.text-red-700]="evt.color === 'red'"
                  [class.border-red-200]="evt.color === 'red'"
                  (click)="$event.stopPropagation(); alertBox(evt.title)"
                >
                  {{ evt.title }}
                </div>
              }

              @if (day.events.length === 0 && day.isCurrentMonth) {
                <button
                  class="text-[10px] text-muted-foreground hover:text-primary text-left opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  + Add
                </button>
              }
            </div>
          </ng-template>
        </wdc-calendar>
      </section>
    </div>
  `,
})
export class CalendarDemoComponent {
  selected = signal(new Date());

  myEvents: CalendarEvent[] = [
    { date: new Date(), title: 'Project Launch', color: 'blue' },
    { date: this.addDays(2), title: 'Tax Deadline', color: 'red' },
    { date: this.addDays(2), title: 'Team Dinner', color: 'blue' },
    { date: this.addDays(5), title: 'Client Meeting', color: 'blue' },
  ];

  onDateSelect(date: Date) {
    console.log('User clicked date:', date);
    this.selected.set(date);
  }

  private addDays(days: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  alertBox(event: any) {
    console.log(event);
  }
}
