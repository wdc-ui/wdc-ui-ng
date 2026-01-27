import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AVATAR_COMPONENTS } from './avatar.component'; // Ensure path is correct

@Component({
  selector: 'wdc-avatar-profile',
  standalone: true,
  imports: [CommonModule, AVATAR_COMPONENTS],
  template: `
    <div class="flex items-center gap-3">
      <wdc-avatar [size]="size()" [shape]="shape()" class="relative">
        <wdc-avatar-fallback [class]="fallbackColorClass()">
          {{ initials() }}
        </wdc-avatar-fallback>

        @if (src()) {
          <img [src]="src()" [alt]="name()" wdcAvatarImage />
        }

        @if (status()) {
          <wdc-avatar-indicator [status]="status()!" [size]="size()" />
        }
      </wdc-avatar>

      @if (showText()) {
        <div class="flex flex-col text-left">
          <span class="font-semibold text-foreground text-sm leading-none">
            {{ name() }}
          </span>
          @if (email()) {
            <span class="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">
              {{ email() }}
            </span>
          }
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
})
export class AvatarProfileComponent {
  name = input.required<string>();
  email = input<string>('');
  src = input<string | null>(null);

  // Config Inputs
  size = input<'xs' | 'sm' | 'default' | 'lg' | 'xl'>('default');
  shape = input<'circle' | 'rounded' | 'square'>('circle');
  status = input<'online' | 'offline' | 'busy' | 'away' | null>(null);
  showText = input(true);

  initials = computed(() => {
    const n = this.name()?.trim();
    if (!n) return '';
    const parts = n.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  // Random Color Logic based on Name length (Simple Hack)
  fallbackColorClass() {
    const colors = [
      'bg-red-100 text-red-700',
      'bg-green-100 text-green-700',
      'bg-blue-100 text-blue-700',
      'bg-yellow-100 text-yellow-700',
      'bg-purple-100 text-purple-700',
    ];
    // Name ki length se index nikalo taaki same name par same color rahe
    const index = this.name().length % colors.length;
    return colors[index];
  }
}
