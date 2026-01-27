export type CalendarView = 'month' | 'year';

export interface CalendarEvent {
  date: Date; // Event date
  title: string; // For tooltip/label
  color?: string; // Custom dot color (default: current text color)
}

export interface DayCustomization {
  date: Date;
  className?: string; // Custom CSS classes (e.g. 'bg-green-100 text-green-700')
  style?: Record<string, string>; // Inline styles
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  customization?: DayCustomization;
}
