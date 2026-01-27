import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  contentChild,
  TemplateRef,
  Directive,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { CalendarDay, CalendarEvent } from './calendar.models';

// --- 1. DIRECTIVE FOR CUSTOM DAY CONTENT ---
export interface CalendarCellContext {
  $implicit: Date;
  day: CalendarDay;
}

@Directive({
  selector: '[wdcCalendarCell]',
  standalone: true,
})
export class CalendarCellDirective {
  constructor(public template: TemplateRef<CalendarCellContext>) {}

  static ngTemplateContextGuard(
    dir: CalendarCellDirective,
    ctx: unknown,
  ): ctx is CalendarCellContext {
    return true;
  }
}

// --- 2. CALENDAR COMPONENT ---
@Component({
  selector: 'wdc-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ButtonComponent, DatePipe],
  template: `
    <div
      class="bg-background border border-border overflow-hidden"
      [class.rounded-xl]="!gridMode()"
      [class.shadow-sm]="!gridMode()"
      [class.w-full]="gridMode()"
      [class.max-w-md]="!gridMode()"
      [class.mx-auto]="!gridMode()"
    >
      <div
        class="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-b border-border bg-muted/20"
      >
        <div class="flex items-center gap-2 order-2 sm:order-1">
          <wdc-button variant="ghost" size="icon" class="h-8 w-8" (click)="addMonths(-1)">
            <wdc-icon name="chevron_left" size="18" />
          </wdc-button>
          <wdc-button variant="ghost" size="icon" class="h-8 w-8" (click)="addMonths(1)">
            <wdc-icon name="chevron_right" size="18" />
          </wdc-button>
          <wdc-button variant="outline" size="sm" (click)="goToToday()">Today</wdc-button>
        </div>

        <div class="flex items-center gap-2 order-1 sm:order-2">
          <select
            [ngModel]="currentMonth()"
            (ngModelChange)="onMonthChange($event)"
            class="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            @for (m of months; track $index) {
              <option [value]="$index">{{ m }}</option>
            }
          </select>

          <select
            [ngModel]="currentYear()"
            (ngModelChange)="onYearChange($event)"
            class="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            @for (y of years(); track y) {
              <option [value]="y">{{ y }}</option>
            }
          </select>
        </div>
      </div>

      <div class="animate-in fade-in zoom-in-95 duration-300">
        <div class="grid grid-cols-7 border-b border-border">
          @for (day of weekDays; track day) {
            <div
              class="text-center text-xs font-semibold text-muted-foreground py-2 uppercase tracking-wide"
              [class.border-r]="gridMode()"
              [class.last:border-r-0]="gridMode()"
            >
              {{ day }}
            </div>
          }
        </div>

        <div class="grid grid-cols-7" [class.gap-1]="!gridMode()" [class.p-2]="!gridMode()">
          @for (day of calendarDays(); track day.date.toISOString()) {
            <div
              (click)="selectDate(day)"
              class="relative transition-all cursor-pointer group"
              [class.h-10]="!gridMode()"
              [class.flex]="!gridMode()"
              [class.items-center]="!gridMode()"
              [class.justify-center]="!gridMode()"
              [class.rounded-md]="!gridMode()"
              [class.min-h-[120px]]="gridMode()"
              [class.p-2]="gridMode()"
              [class.border-b]="gridMode()"
              [class.border-r]="gridMode()"
              [class.last:border-r-0]="gridMode() && ($index + 1) % 7 === 0"
              [class.opacity-40]="!day.isCurrentMonth"
              [class.bg-accent]="day.isSelected && gridMode()"
              [class.hover:bg-accent/50]="!day.isSelected"
            >
              <div class="flex items-center justify-between" [class.justify-center]="!gridMode()">
                <span
                  class="text-sm leading-none h-7 w-7 flex items-center justify-center rounded-full transition-colors"
                  [class.bg-primary]="day.isToday && !gridMode()"
                  [class.text-primary-foreground]="day.isToday && !gridMode()"
                  [class.font-bold]="day.isToday"
                  [class.bg-primary]="day.isToday && gridMode()"
                  [class.text-primary-foreground]="day.isToday && gridMode()"
                >
                  {{ day.date.getDate() }}
                </span>
              </div>

              @if (gridMode()) {
                <div class="mt-1 w-full space-y-1 overflow-hidden">
                  @if (cellTemplate()) {
                    <ng-container
                      *ngTemplateOutlet="
                        cellTemplate()!.template;
                        context: { $implicit: day.date, day: day }
                      "
                    ></ng-container>
                  } @else {
                    @for (evt of day.events.slice(0, 3); track $index) {
                      <div
                        class="text-xs truncate px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700 font-medium"
                      >
                        {{ evt.title }}
                      </div>
                    }
                  }
                </div>
              } @else {
                @if (day.events.length > 0) {
                  <div class="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    <span class="h-1 w-1 rounded-full bg-primary"></span>
                  </div>
                }
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class CalendarComponent {
  // --- INPUTS ---
  selectedDate = input<Date | null>(null);
  events = input<CalendarEvent[]>([]);
  gridMode = input(false); // Toggle between Picker (Compact) and Planner (Grid)

  // --- OUTPUTS ---
  dateChange = output<Date>();

  // --- TEMPLATE ---
  cellTemplate = contentChild(CalendarCellDirective);

  // --- STATE ---
  viewDate = signal(new Date()); // Tracks the currently visible month/year

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Helpers for UI binding
  currentMonth = computed(() => this.viewDate().getMonth());
  currentYear = computed(() => this.viewDate().getFullYear());

  // Generate Year Range (Current - 10 to Current + 10)
  years = computed(() => {
    const current = new Date().getFullYear();
    const start = current - 10;
    return Array.from({ length: 21 }, (_, i) => start + i);
  });

  constructor() {
    effect(() => {
      const selected = this.selectedDate();
      if (selected) {
        this.viewDate.set(new Date(selected));
      }
    });
  }

  // --- LOGIC: Grid Generation ---
  calendarDays = computed(() => {
    const year = this.viewDate().getFullYear();
    const month = this.viewDate().getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Grid needs exactly 42 cells (6 rows x 7 cols) to cover all scenarios
    const totalSlots = 42;
    const days: CalendarDay[] = [];

    // 1. Previous Month Padding
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push(this.createDay(new Date(year, month - 1, prevMonthLastDate - i), false));
    }

    // 2. Current Month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(this.createDay(new Date(year, month, i), true));
    }

    // 3. Next Month Padding
    const remaining = totalSlots - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push(this.createDay(new Date(year, month + 1, i), false));
    }

    return days;
  });

  private createDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const today = new Date();
    const selected = this.selectedDate();

    // Filter events for this specific day
    const dayEvents = this.events().filter(
      (e) =>
        e.date.getDate() === date.getDate() &&
        e.date.getMonth() === date.getMonth() &&
        e.date.getFullYear() === date.getFullYear(),
    );

    return {
      date,
      isCurrentMonth,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: selected ? date.toDateString() === new Date(selected).toDateString() : false,
      events: dayEvents,
    };
  }

  // --- ACTIONS ---

  addMonths(amount: number) {
    const d = new Date(this.viewDate());
    d.setMonth(d.getMonth() + amount);
    this.viewDate.set(d);
  }

  onMonthChange(monthIndex: string | number) {
    const d = new Date(this.viewDate());
    d.setMonth(Number(monthIndex));
    this.viewDate.set(d);
  }

  onYearChange(year: string | number) {
    const d = new Date(this.viewDate());
    d.setFullYear(Number(year));
    this.viewDate.set(d);
  }

  goToToday() {
    this.viewDate.set(new Date());
  }

  selectDate(day: CalendarDay) {
    // If user clicks a grayed out date from next/prev month, jump to that month
    if (!day.isCurrentMonth) {
      this.viewDate.set(new Date(day.date));
    }
    this.dateChange.emit(day.date);
  }
}
