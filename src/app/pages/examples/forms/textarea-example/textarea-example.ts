import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dedent } from '@shared/utils/dedent';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { TocService } from 'src/app/core/services/toc.service';
import { TextareaComponent } from '@wdc-ui/ng/textarea/textarea.component';
import { NoteBlockComponent } from '@shared/components/note-block/note-block.component';
import { MarkdownViewerComponent } from '@shared/components/markdown-viewer/markdown-viewer.component';

@Component({
  selector: 'wdc-textarea-example',
  imports: [
    UiConfig,
    FormsModule,
    CommonModule,
    TextareaComponent,
    NoteBlockComponent,
    MarkdownViewerComponent,
  ],
  templateUrl: './textarea-example.html',
})
export class TextareaExample {
  private tocService = inject(TocService);
  AppSetting = AppSetting;

  ngOnInit() {
    // Manually define the headings for this page
    this.tocService.setToc([
      { id: 'installation', title: 'Installation', level: 'h2' },
      { id: 'examples', title: 'Examples', level: 'h2' },
      { id: 'references', title: 'API References', level: 'h2' },
    ]);
  }

  appleVal = false;
  orangeVal = true;
  bananaVal = true;

  markdownData = `
    This component uses the following:

    - Association: The component generates a unique ID (wdc-textarea-1) and links the \`<label>\` via \`for\` and the error message via \`aria-describedby\`. This ensures screen readers announce "Label, Invalid entry: Error message" seamlessly.
    - Resizing: The default behavior allows vertical resizing (browser default). You can disable this via class if needed (\`class="resize-none"\`).

    Check out [Google Search Central](https://developers.google.com/search) for more details.
`;

  references: ReferenceItem[] = [
    {
      input: 'label',
      type: 'string',
      default: "''",
      description: 'Label displayed above the textarea.',
    },
    {
      input: 'placeholder',
      type: 'string',
      default: "''",
      description: 'Placeholder text.',
    },
    {
      input: 'rows',
      type: 'number',
      default: '3',
      description: 'Number of visible text lines.',
    },
    {
      input: 'error',
      type: 'string | null',
      default: 'null',
      description: 'Error message text. Changes border to red.',
    },
    {
      input: 'success',
      type: 'boolean',
      default: 'false',
      description: 'If true, changes border to green.',
    },
    {
      input: 'hint',
      type: 'string | null',
      default: 'null',
      description: 'Helper text displayed below the textarea.',
    },
  ];

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} textarea`),
    basic: {
      html: dedent(`
      <div class="w-full max-w-sm">
        <wdc-textarea 
          label="Bio" 
          placeholder="Tell us a little bit about yourself" 
        />
      </div>`),
      ts: ``,
    },
    validation: {
      html: dedent(`
      <div class="w-full max-w-sm space-y-4">
        <wdc-textarea
          label="Message"
          rows="4"
          error="Message must be at least 10 characters."
          value="Hi"
        />

        <wdc-textarea
          label="Feedback"
          [success]="true"
          successMessage="Thanks for your feedback!"
          value="Great service!"
        />
      </div>`),
      ts: ``,
    },
    disabled: {
      html: dedent(`
      <div class="w-full max-w-sm">
        <wdc-textarea
          label="Read Only"
          [disabled]="true"
          value="This content cannot be edited."
        />
      </div>`),
      ts: ``,
    },
  };
}
