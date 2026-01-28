import { Component, input, ViewEncapsulation } from '@angular/core';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'wdc-markdown',
  standalone: true,
  imports: [MarkdownModule],
  template: `
    <div class="prose markdown-container prose-slate max-w-none dark:prose-invert">
      <markdown [data]="content()"></markdown>
    </div>
  `,
  // Encapsulation.None is important if you want to style internal
  // markdown tags from your global CSS
  encapsulation: ViewEncapsulation.None,
  providers: [MarkdownService],
})
export class MarkdownViewerComponent {
  content = input.required<string>();
}
