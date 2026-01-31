import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for [(ngModel)] on selects
import { IconComponent } from '../icon/icon.component';
import { cn } from '@shared/utils/cn';

@Component({
  selector: 'wdc-calendar',
  standalone: true,
  imports: [CommonModule, IconComponent, FormsModule],
  template: `
    <div [class]="computedClass()">
      <div class="flex items-center justify-between pt-1 relative gap-2">
        <div class="flex items-center gap-1 flex-1">
          <div class="relative group">
            <select
              [ngModel]="currentMonthIndex()"
              (ngModelChange)="setMonth($event)"
              class="appearance-none h-8 bg-transparent pl-2 pr-6 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              @for (month of months; track $index) {
                <option [value]="$index" class="bg-popover text-popover-foreground">
                  {{ month }}
                </option>
              }
            </select>
            <wdc-icon
              name="keyboard_arrow_down"
              size="16"
              class="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"
            />
          </div>

          <div class="relative group">
            <select
              [ngModel]="currentYear()"
              (ngModelChange)="setYear($event)"
              class="appearance-none h-8 w-[80px] bg-transparent pl-2 pr-6 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              @for (year of years(); track year) {
                <option [value]="year" class="bg-popover text-popover-foreground">
                  {{ year }}
                </option>
              }
            </select>
            <wdc-icon
              name="keyboard_arrow_down"
              size="16"
              class="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"
            />
          </div>
        </div>

        <div class="flex items-center space-x-1">
          <button
            type="button"
            (click)="prevMonth()"
            class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <wdc-icon name="chevron_left" size="18" />
          </button>
          <button
            type="button"
            (click)="nextMonth()"
            class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <wdc-icon name="chevron_right" size="18" />
          </button>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-7 w-full">
        @for (day of weekDays; track day) {
          <span class="text-muted-foreground rounded-md font-normal text-[0.8rem] text-center">
            {{ day }}
          </span>
        }
      </div>

      <div class="flex w-full mt-2 flex-col space-y-2">
        @for (week of calendarGrid(); track $index) {
          <div class="grid grid-cols-7 w-full">
            @for (dateObj of week; track $index) {
              @if (dateObj) {
                <button type="button" (click)="selectDate(dateObj)" [class]="getDayClass(dateObj)">
                  {{ dateObj.getDate() }}
                </button>
              } @else {
                <div class="w-9 h-9"></div>
              }
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class UxCalendarComponent {
  selectedDate = input<Date | null>(null);
  onSelect = output<Date>();
  class = input<string>('');

  // Configurable Years
  startYear = input<number>(1900);
  endYear = input<number>(2100);

  // View State
  viewDate = signal(new Date());

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
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

  computedClass = computed(() => cn('p-3', this.class()));

  // Helpers for Template
  currentMonthIndex = computed(() => this.viewDate().getMonth());
  currentYear = computed(() => this.viewDate().getFullYear());

  // Generate Year Range (e.g. 1900 - 2100)
  years = computed(() => {
    const start = this.startYear();
    const end = this.endYear();
    const arr = [];
    // Generate reverse so recent years are at top if you prefer, or normal order
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  });

  // Grid Logic (Same as before)
  calendarGrid = computed(() => {
    const year = this.viewDate().getFullYear();
    const month = this.viewDate().getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startDayIndex = firstDay.getDay();

    const grid: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    for (let i = 0; i < startDayIndex; i++) {
      currentWeek.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(new Date(year, month, day));
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      grid.push(currentWeek);
    }

    return grid;
  });

  // --- Actions ---

  // Called by Month Dropdown
  setMonth(monthIndex: string | number) {
    const m = Number(monthIndex);
    const d = this.viewDate();
    // Use setMonth safely (handles day overflow like Feb 30 -> Mar 2)
    const newDate = new Date(d.getFullYear(), m, 1);
    this.viewDate.set(newDate);
  }

  // Called by Year Dropdown
  setYear(year: string | number) {
    const y = Number(year);
    const d = this.viewDate();
    const newDate = new Date(y, d.getMonth(), 1);
    this.viewDate.set(newDate);
  }

  prevMonth() {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth() {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  selectDate(date: Date) {
    this.onSelect.emit(date);
    this.viewDate.set(new Date(date));
  }

  getDayClass(date: Date): string {
    const isSelected = this.isSameDay(date, this.selectedDate());
    const isToday = this.isSameDay(date, new Date());

    return cn(
      'h-9 w-9 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      !isSelected && 'hover:bg-accent hover:text-accent-foreground',
      isSelected &&
        'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
      isToday && !isSelected && 'bg-accent text-accent-foreground',
      (date.getDay() === 0 || date.getDay() === 6) && !isSelected && 'text-muted-foreground',
    );
  }

  private isSameDay(d1: Date | null, d2: Date | null): boolean {
    if (!d1 || !d2) return false;
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }
}
