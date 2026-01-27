import {
  Directive,
  input,
  HostListener,
  signal,
  inject,
  ElementRef,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[wdcCopy]',
  standalone: true,
  exportAs: 'wdcCopy', // Allows using #ref="wdcCopy" in template
})
export class CopyClipboardDirective {
  textToCopy = input.required<string>({ alias: 'wdcCopy' });

  // Expose state to the template
  copied = signal(false);

  @HostListener('click')
  async copy() {
    try {
      await navigator.clipboard.writeText(this.textToCopy());

      // Visual Feedback
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000); // Reset after 2s
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }
}
