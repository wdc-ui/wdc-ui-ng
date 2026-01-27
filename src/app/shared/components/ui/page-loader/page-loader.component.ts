import {
  booleanAttribute,
  Component,
  computed,
  DOCUMENT,
  effect,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { PageLoaderService } from './page-loader.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { cn } from '@shared/utils/cn';

@Component({
  selector: 'wdc-page-loader',
  standalone: true,
  imports: [SpinnerComponent],
  template: `
    @if (shouldShow()) {
      <div [class]="computedClass()">
        <div class="flex flex-col items-center gap-2">
          <wdc-spinner [size]="mode() === 'fullscreen' ? 'xl' : 'lg'" color="primary" />

          @if (text()) {
            <p class="text-sm font-medium text-muted-foreground animate-pulse">
              {{ text() }}
            </p>
          }
        </div>
      </div>
    }
  `,
})
export class PageLoaderComponent {
  private globalLoader = inject(PageLoaderService);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  loader = inject(PageLoaderService);
  loading = input(false, { transform: booleanAttribute });
  mode = input<'fullscreen' | 'absolute'>('fullscreen');
  text = input<string>('Loading...');
  class = input('');

  shouldShow = computed(() => {
    if (this.mode() === 'fullscreen') {
      return this.globalLoader.isLoading();
    }
    return this.loading();
  });

  computedClass = computed(() =>
    cn(
      'z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200',
      this.mode() === 'fullscreen' ? 'fixed inset-0' : 'absolute inset-0 rounded-inherit',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      // Agar loader dikh raha hai AUR mode fullscreen hai
      if (this.shouldShow() && this.mode() === 'fullscreen') {
        // Body par overflow-hidden lagao
        this.renderer.addClass(this.document.body, 'overflow-hidden');
      } else {
        // Nahi to hatao
        this.renderer.removeClass(this.document.body, 'overflow-hidden');
      }
    });
  }
}
