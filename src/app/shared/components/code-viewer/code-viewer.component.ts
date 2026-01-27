import {
  Component,
  Input,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
  effect,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);

type LangType = 'html' | 'ts' | 'css' | 'bash';

@Component({
  selector: 'app-code-viewer',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './code-viewer.component.html',
})
export class CodeViewerComponent implements OnChanges {
  @Input() htmlCode: string = '';
  @Input() tsCode: string = '';
  @Input() cssCode: string = '';
  @Input() bashCode: string = '';
  @Input() activeTabCode: LangType = 'html';
  @Input() title: string = '';

  @ViewChild('codeBlock') codeBlock!: ElementRef;

  activeTab = signal<LangType>('html');
  copied = signal(false);

  constructor() {
    effect(() => {
      // Re-highlight when tab changes
      this.activeTab();
      setTimeout(() => this.highlight(), 0);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['htmlCode'] || changes['tsCode'] || changes['cssCode'] || changes['bashCode']) {
      setTimeout(() => this.highlight(), 0);
    }

    if (changes['activeTabCode']) {
      this.activeTab.set(changes['activeTabCode'].currentValue);
    }
  }

  get activeCode(): string {
    switch (this.activeTab()) {
      case 'html':
        return this.htmlCode;
      case 'ts':
        return this.tsCode;
      case 'css':
        return this.cssCode;
      case 'bash':
        return this.bashCode;
    }
  }

  get activeLanguage(): string {
    switch (this.activeTab()) {
      case 'html':
        return 'xml';
      case 'ts':
        return 'typescript';
      case 'css':
        return 'css';
      case 'bash':
        return 'bash';
    }
  }

  highlight() {
    if (this.codeBlock && this.codeBlock.nativeElement) {
      // manually highlighting for better control
      const code = this.activeCode;
      const language = this.activeLanguage;
      if (code) {
        const result = hljs.highlight(code, { language });
        this.codeBlock.nativeElement.innerHTML = result.value;
      } else {
        this.codeBlock.nativeElement.innerHTML = '';
      }
    }
  }

  copyCode() {
    navigator.clipboard.writeText(this.activeCode);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
