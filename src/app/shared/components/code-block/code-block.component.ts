import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  effect,
  viewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
declare var hljs: any; // Declare highlight.js to access it from the global scope

type CodeTab = 'html' | 'ts';
@Component({
  selector: 'app-code-block',
  imports: [],
  templateUrl: './code-block.component.html',
})
export class CodeBlockComponent {
  htmlCode = input.required<string>();
  tsCode = input<string>('');

  activeTab = signal<CodeTab>('html');
  copied = signal(false);

  codeElement = viewChild<ElementRef<HTMLElement>>('codeElement');

  constructor() {
    effect(() => {
      const element = this.codeElement()?.nativeElement;
      if (element) {
        // Set the text content based on the active tab
        const codeToDisplay = this.activeTab() === 'html' ? this.htmlCode() : this.tsCode();
        element.textContent = codeToDisplay;

        // Remove the data-highlighted attribute to allow hljs to re-highlight the block
        element.removeAttribute('data-highlighted');

        // Apply highlighting
        hljs.highlightElement(element);
      }
    });
  }

  selectTab(tab: CodeTab) {
    this.activeTab.set(tab);
  }

  copyCode() {
    const codeToCopy = this.activeTab() === 'html' ? this.htmlCode() : this.tsCode();
    navigator.clipboard.writeText(codeToCopy);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
