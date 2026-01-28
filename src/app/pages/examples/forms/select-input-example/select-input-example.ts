import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownViewerComponent } from '@shared/components/markdown-viewer/markdown-viewer.component';
import { NoteBlockComponent } from '@shared/components/note-block/note-block.component';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { MultiSelectComponent } from '@wdc-ui/ng/multi-select/multi-select.component';
import { SelectComponent } from '@wdc-ui/ng/select/select.component';
import { TocService } from 'src/app/core/services/toc.service';

@Component({
  selector: 'app-select-input-example',
  standalone: true,
  imports: [
    UiConfig,
    SelectComponent,
    FormsModule,
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    MultiSelectComponent,
    NoteBlockComponent,
    MarkdownViewerComponent,
  ],
  templateUrl: './select-input-example.html',
})
export class SelectInputExample {
  fb = inject(FormBuilder);
  private tocService = inject(TocService);

  ngOnInit() {
    // Manually define the headings for this page
    this.tocService.setToc([
      { id: 'installation', title: 'Installation', level: 'h2' },
      { id: 'examples', title: 'Examples', level: 'h2' },
      { id: 'singleSelection', title: 'Single Select', level: 'h2' },
      { id: 'multiSelection', title: 'Multi Select', level: 'h2' },
      { id: 'multiReferences', title: 'API References', level: 'h2' },
    ]);
  }

  fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  selectedFruit = '';

  countries = [
    { code: 'US', label: 'United States' },
    { code: 'IN', label: 'India' },
    { code: 'CA', label: 'Canada' },
  ];
  countrySig = signal('IN');

  users = [
    { id: 101, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 102, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 103, name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 104, name: 'David Lee', email: 'david@example.com' },
  ];

  // Data Source 2: Simple Strings
  priorities = ['Low', 'Medium', 'High', 'Critical'];

  members = [
    { id: 1, name: 'Kamal Singh', role: 'Dev' },
    { id: 2, name: 'Rahul Sharma', role: 'QA' },
    { id: 3, name: 'Priya Patel', role: 'Design' },
    { id: 4, name: 'Amit Verma', role: 'Manager' },
    { id: 5, name: 'Sneha Gupta', role: 'Dev' },
  ];

  skills = ['Angular', 'React', 'Node.js', 'Python', 'AWS', 'Docker'];

  form = this.fb.group({
    userId: [null, Validators.required], // Start empty
    priority: ['Medium'], // Start with default
  });

  multSelectform = this.fb.group({
    team: [
      [1, 3],
      [Validators.required, Validators.minLength(2)],
    ], // Initial selection IDs
    skills: [['Angular']],
  });

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      alert('Form Valid!');
    }
  }

  onTeamSubmit() {
    this.multSelectform.markAllAsTouched();
    if (this.multSelectform.valid) {
      alert('Team Created!');
    }
  }

  references: ReferenceItem[] = [
    {
      input: 'options',
      type: 'any[]',
      default: 'required',
      description: 'Array of items to display in the dropdown.',
    },
    {
      input: 'bindLabel',
      type: 'string',
      default: "'label'",
      description: 'Property name to display as the label (e.g., "name").',
    },
    {
      input: 'bindValue',
      type: 'string',
      default: "'value'",
      description: 'Property name to use as the value (e.g., "id").',
    },
    {
      input: 'searchable',
      type: 'boolean',
      default: 'true',
      description: 'Enables a search input inside the dropdown.',
    },
    {
      input: 'label',
      type: 'string',
      default: "''",
      description: 'Label displayed above the select trigger.',
    },
    {
      input: 'placeholder',
      type: 'string',
      default: "'Select an option'",
      description: 'Placeholder text when no value is selected.',
    },
  ];

  noteContent = `The select component uses a button trigger with aria-expanded and a proper label. While custom select menus are harder for crawlers than native <select>, this implementation follows accessibility guidelines (WAI-ARIA) ensuring screen readers can announce the label and state correctly.`;

  singleSnippets = {
    install: dedent(`${AppSetting.addComponentCmd} select`),
    basic: {
      html: dedent(`<div class="w-full max-w-xs">
        <wdc-select 
          label="Favorite Fruit" 
          [options]="['Apple', 'Banana', 'Orange', 'Mango']"
          placeholder="Select a fruit"
        />
      </div>`),
      ts: dedent(``),
    },
    objects: {
      html: dedent(`
      <div class="w-full max-w-xs">
        <wdc-select
          label="Assign User"
          [options]="users"
          bindLabel="name"
          bindValue="id"
          placeholder="Select user..."
        />

        <section class="mt-6">
            <wdc-select
              label="Signal Country"
              [options]="countries"
              bindLabel="label"
              bindValue="code"
              [ngModel]="countrySig()"
              [searchable]="false"
              (ngModelChange)="countrySig.set($event)"
              hint="Binding directly to a WritableSignal"
            ></wdc-select>

            <p class="text-sm mb-2">
              Signal Value: <strong>{{ countrySig() }}</strong>
            </p>
            <wdc-button (click)="countrySig.set('CA')" size="sm" variant="outline"
              >Set Canada</wdc-button
            >
          </section>
      </div>`),
      ts: dedent(`
      users = [
        { id: 1, name: 'Alice Johnson', role: 'Admin' },
        { id: 2, name: 'Bob Smith', role: 'Editor' },
        { id: 3, name: 'Charlie Brown', role: 'Viewer' }
      ];
      countries = [
        { code: 'US', label: 'United States' },
        { code: 'IN', label: 'India' },
        { code: 'CA', label: 'Canada' },
      ];
      countrySig = signal('IN');`),
    },
    validation: {
      html: dedent(`
      <div class="w-full max-w-xs space-y-4">
        <wdc-select
          label="Country"
          [options]="['USA', 'India', 'Canada']"
          error="Please select your country."
        />

        <wdc-select
          label="Disabled Select"
          [options]="[]"
          [disabled]="true"
          placeholder="Cannot select"
        />
      </div>`),
      ts: ``,
    },
  };

  multiSnippets = {
    install: dedent(`${AppSetting.addComponentCmd} multi-select`),
    basic: {
      html: dedent(`
      <div class="w-full max-w-sm">
        <wdc-multi-select 
          label="Skills" 
          [options]="['Angular', 'React', 'Node.js', 'Python', 'Go']"
          placeholder="Select skills..."
        />
      </div>`),
      ts: ``,
    },
    objects: {
      html: dedent(`
      <div class="w-full max-w-sm">
        <wdc-multi-select
          label="Team Members"
          [options]="team"
          bindLabel="name"
          bindValue="id"
          placeholder="Add members..."
        />
      </div>`),
      ts: dedent(`
      team = [
        { id: 1, name: 'Kamal Kumar', role: 'Dev' },
        { id: 2, name: 'Rahul Sharma', role: 'Manager' },
        { id: 3, name: 'Priya Singh', role: 'Designer' },
        { id: 4, name: 'Amit Verma', role: 'QA' }
      ];`),
    },
    validation: {
      html: dedent(`
      <div class="w-full max-w-sm space-y-4">
        <wdc-multi-select
          label="Required Tags"
          [options]="['Bug', 'Feature', 'Enhancement']"
          error="At least one tag is required."
        />

        <wdc-multi-select
          label="Approved By"
          [options]="['Manager', 'Director', 'VP']"
          [success]="true"
          [ngModel]="['Manager']"
        />
      </div>`),
      ts: ``,
    },
  };
}
