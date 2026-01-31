import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownViewerComponent } from '@shared/components/markdown-viewer/markdown-viewer.component';
import { NoteBlockComponent } from '@shared/components/note-block/note-block.component';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { DatePickerComponent } from '@wdc-ui/ng/date-picker/date-picker.component';
import { TocService } from 'src/app/core/services/toc.service';

@Component({
  selector: 'wdc-datepicker-example',
  imports: [
    UiConfig,
    FormsModule,
    DatePickerComponent,
    NoteBlockComponent,
    MarkdownViewerComponent,
  ],
  templateUrl: './datepicker-example.html',
})
export class DatepickerExample {
  private tocService = inject(TocService);

  ngOnInit() {
    // Manually define the headings for this page
    this.tocService.setToc([
      { id: 'installation', title: 'Installation', level: 'h2' },
      { id: 'examples', title: 'Examples', level: 'h2' },
      { id: 'references', title: 'API References', level: 'h2' },
    ]);
  }

  markdownData = `
    * **Keyboard Nav:** The calendar supports simple click interaction. For full accessibility, the trigger button has \`aria-expanded\` attributes.
    * **Semantic:** The calendar grid doesn't strictly follow the complex WAI-ARIA \`<grid>\` pattern for keyboard arrows (left/right/up/down) in this lightweight version, but the buttons are tab-accessible.
    * **SEO:** The Label and Input association is maintained via the wrapper logic.`;

  references: ReferenceItem[] = [
    {
      input: 'format',
      type: 'string',
      default: "'mediumDate'",
      description: 'Format string for the displayed date (Angular DatePipe format).',
    },
    {
      input: 'label',
      type: 'string',
      default: "''",
      description: 'Label displayed above the date picker.',
    },
    {
      input: 'placeholder',
      type: 'string',
      default: "'Pick a date'",
      description: 'Text displayed when no date is selected.',
    },
    {
      input: 'error',
      type: 'string | null',
      default: 'null',
      description: 'Error message (Changes border to red).',
    },
    {
      input: 'success',
      type: 'boolean',
      default: 'false',
      description: 'Success state (Changes border to green).',
    },
  ];

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} datepicker`),
    basic: {
      html: dedent(`
      <div class="w-full max-w-xs">
        <wdc-date-picker 
          label="Date of Birth" 
          placeholder="Select DOB" 
        />
      </div>`),
      ts: ``,
    },
    formatted: {
      html: dedent(`
      <div class="w-full max-w-xs">
        <wdc-date-picker 
          label="Meeting Date" 
          format="fullDate" 
          placeholder="Select date..." 
        />
      </div>`),
      ts: ``,
    },
    validation: {
      html: dedent(`
      <div class="w-full max-w-xs space-y-4">
        <wdc-date-picker
          label="Deadline"
          error="Date is required."
        />

        <wdc-date-picker
          label="Start Date"
          [success]="true"
          [ngModel]="today"
        />
      </div>`),
      ts: dedent(`
      today = new Date();`),
    },
  };
}
