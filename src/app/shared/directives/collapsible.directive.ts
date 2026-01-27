import { Directive, input, ElementRef, OnChanges, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[wdcCollapsible]',
  standalone: true,
})
export class CollapsibleDirective implements OnChanges {
  // Input: True to expand, False to collapse
  isOpen = input.required<boolean>({ alias: 'wdcCollapsible' });

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnInit() {
    // Set base styles for the grid trick
    this.renderer.setStyle(this.el.nativeElement, 'display', 'grid');
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'grid-template-rows 300ms ease-out',
    );
  }

  ngOnChanges() {
    // Toggle between 0fr (closed) and 1fr (open)
    const rowValue = this.isOpen() ? '1fr' : '0fr';
    this.renderer.setStyle(this.el.nativeElement, 'grid-template-rows', rowValue);
  }
}
