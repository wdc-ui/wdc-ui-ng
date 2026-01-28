import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';

@Component({
  selector: 'wdc-note-block',
  imports: [],
  templateUrl: './note-block.component.html',
})
export class NoteBlockComponent {
  // Types: info, warning, danger, success
  type = input<'info' | 'warning' | 'danger' | 'success'>('info');
  title = input<string>('');

  getIcon(): string {
    const icons = {
      info: 'info',
      warning: 'warning',
      danger: 'error',
      success: 'check_circle',
    };
    return icons[this.type()];
  }

  getClass() {
    return cn('flex border-l-4 p-4', {
      'border-blue-500 bg-blue-50 text-blue-900': this.type() === 'info',
      'border-amber-500 bg-amber-50 text-amber-900': this.type() === 'warning',
      'border-red-500 bg-red-50 text-red-900': this.type() === 'danger',
      'border-emerald-500 bg-emerald-50 text-emerald-900': this.type() === 'success',
    });
  }
}
