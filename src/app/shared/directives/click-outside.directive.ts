import { Directive, ElementRef, output, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[wdcClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  clickOutside = output<void>(); // Emits event when clicked outside

  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
