import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { MultiSelectComponent } from '@wdc-ui/ng/multi-select/multi-select.component';
import { SelectComponent } from '@wdc-ui/ng/select/select.component';

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
  ],
  templateUrl: './select-input-example.html',
})
export class SelectInputExample {
  fb = inject(FormBuilder);

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
      type: '{ label: string; value: any }[]',
      default: 'undefined',
      description: 'Options for the select input field.',
    },
    {
      input: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether the select input field is disabled.',
    },
    {
      input: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Whether the select input field supports multiple selection.',
    },
    {
      input: 'searchable',
      type: 'boolean',
      default: 'false',
      description: 'Whether the select input field supports searching.',
    },
    {
      input: 'label',
      type: 'string',
      default: 'undefined',
      description: 'Label text for the select input field.',
    },
    {
      input: 'placeholder',
      type: 'string',
      default: 'Select an option',
      description: 'Placeholder text for the select input field.',
    },
    {
      input: 'error',
      type: 'string | null',
      default: 'null',
      description: 'Error message to display when the select input field is invalid.',
    },
    {
      input: 'onChange',
      type: 'any',
      default: 'undefined',
      description: 'Callback function called when the value of the select input field changes.',
    },
  ];

  snippets = {
    html: dedent(`<wdc-select-input
            [ngModel]="selectValue()"
            (ngModelChange)="selectValue.set($event)"
            label="Single Select"
            [options]="selectOptions"
          >
          </wdc-select-input>

          <wdc-select-input
            [ngModel]="multiSelectValue()"
            (ngModelChange)="multiSelectValue.set($event)"
            label="Multi Select (Searchable)"
            [multiple]="true"
            [searchable]="true"
            [options]="selectOptions"
          >
          </wdc-select-input>`),
    ts: dedent(`
        import { Component } from '@angular/core';
        import { SelectInputComponent, FormsModule } from '${AppSetting.libName}';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [SelectInputComponent, FormsModule],
        })
        export class ExampleComponent {  
          selectValue = signal('Option 1');
          multiSelectValue = signal(['Option 2', 'Option 3']);
          selectOptions = [
            { label: 'Option 1', value: 'Option 1' },
            { label: 'Option 2', value: 'Option 2' },
            { label: 'Option 3', value: 'Option 3' },
            { label: 'Option 4 - Long text example', value: 'Option 4' },
            { label: 'Option 5', value: 'Option 5' },
          ];
        }`),
  };
}
