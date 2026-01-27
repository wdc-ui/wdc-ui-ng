import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppSetting } from '@shared/constants/app.constant';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { dedent } from '@shared/utils/dedent';
import { CheckboxComponent } from '@wdc-ui/ng/forms/checkbox/checkbox.component';
import { SwitchComponent } from '@wdc-ui/ng/forms/switch/switch.component';
import { RadioGroupComponent, RadioItemComponent } from '@wdc-ui/ng/forms/radio/radio.component';
import { TextareaComponent } from '@wdc-ui/ng/forms/textarea/textarea.component';
import {
  ColorPickerComponent,
  DatePickerComponent,
} from '@wdc-ui/ng/forms/native-pickers/pickers.component';
import { FileUploadComponent } from '@wdc-ui/ng/forms/file-upload/file-upload.component';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { RichTextEditorComponent } from '@wdc-ui/ng/forms/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-other-input-example',
  standalone: true,
  imports: [
    UiConfig,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    JsonPipe,
    CheckboxComponent,
    SwitchComponent,
    RadioGroupComponent,
    RadioItemComponent,
    TextareaComponent,
    DatePickerComponent,
    ColorPickerComponent,
    FileUploadComponent,
    RichTextEditorComponent,
    ButtonComponent,
  ],
  templateUrl: './other-input-example.html',
})
export class OtherInputExample {
  private fb = inject(FormBuilder);

  // --- FORM INITIALIZATION ---
  form: FormGroup = this.fb.group({
    terms: [false, Validators.requiredTrue], // Checkbox (Boolean)
    notifications: [true], // Switch (Boolean)
    plan: ['free', Validators.required], // Radio (String)
    bio: ['', [Validators.minLength(10)]], // Textarea (String)
    dob: [''], // DatePicker (String: YYYY-MM-DD)
    themeColor: ['#6366f1'], // ColorPicker (Hex String)
    avatar: [null, Validators.required], // FileUpload (File Object)
  });

  richTextareaForm = this.fb.group({
    description: ['<p>Initial <strong>bold</strong> content.</p>', Validators.required],
  });
  notes = '<p>Simple notes...</p>';

  submitReactive() {
    this.richTextareaForm.markAllAsTouched();
    if (this.richTextareaForm.valid) {
      alert('Valid Form: ' + JSON.stringify(this.form.value));
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Submitted!', this.form.value);

      // File object ko separately handle karna padta hai agar API bhejna ho
      const file = this.form.get('avatar')?.value;
      if (file) {
        console.log('Selected File:', file.name, file.size);
      }

      alert('Form Valid! Check Console.');
    } else {
      console.log('Form Invalid');
      this.form.markAllAsTouched(); // Saare errors dikhane ke liye
    }
  }

  // Helper to reset form
  reset() {
    this.form.reset({
      terms: false,
      notifications: true,
      plan: 'free',
      themeColor: '#000000',
    });
  }

  references: ReferenceItem[] = [];

  snippets = {
    switch: {
      html: dedent(`<wdc-switch-input
            [ngModel]="switchValue()"
            (ngModelChange)="switchValue.set($event)"
            label="Enable Notifications"
            description="Receive alerts via email"
          >
          </wdc-switch-input>
          <wdc-switch-input
            [ngModel]="soundValue()"
            (ngModelChange)="soundValue.set($event)"
            label="Enable Sound Alerts"
            description="Receive alerts via sound"
          >
          </wdc-switch-input>`),
      ts: dedent(`
        import { Component } from '@angular/core';
        import { SwitchInputComponent, FormsModule } from '${AppSetting.libName}';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [SwitchInputComponent, FormsModule],
        })
        export class ExampleComponent {  
          switchValue = signal(false);
          soundValue = signal(true);
        }`),
    },
    upload: {
      html: dedent(`<wdc-file-input
            [ngModel]="fileValue()"
            (ngModelChange)="fileValue.set($event)"
            label="Upload File"
            accept="image/*"
          >
          </wdc-file-input>`),
      ts: dedent(`
        import { Component } from '@angular/core';
        import { FileInputComponent, FormsModule } from '${AppSetting.libName}';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [FileInputComponent, FormsModule],
        })
        export class ExampleComponent {  
          fileValue = signal(null);
        }`),
    },
    textarea: {
      html: dedent(`<wdc-textarea-input
            [ngModel]="textareaValue()"
            (ngModelChange)="textareaValue.set($event)"
            label="Textarea"
            [rows]="3"
            hint="Supports multiple lines of text"
          >
          </wdc-textarea-input>`),
      ts: dedent(`
        import { Component } from '@angular/core';
        import { TextareaInputComponent, FormsModule } from '${AppSetting.libName}';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [TextareaInputComponent, FormsModule],
        })
        export class ExampleComponent {  
          textareaValue = signal('');
        }`),
    },
    richText: {
      html: dedent(`<wdc-rich-text-editor
            [ngModel]="richTextValue()"
            (ngModelChange)="richTextValue.set($event)"
            label="Rich Text Content"
          >
          </wdc-rich-text-editor>`),
      ts: dedent(`
        import { Component } from '@angular/core';
        import { RichTextEditorComponent, FormsModule } from '${AppSetting.libName}';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [RichTextEditorComponent, FormsModule],
        })
        export class ExampleComponent {  
          richTextValue = signal('');
        }`),
    },
    cd: {
      html: dedent(`<wdc-color-input
            [ngModel]="colorValue()"
            (ngModelChange)="colorValue.set($event)"
            label="Color Picker"
          >
          </wdc-color-input>
          <wdc-date-input
            [ngModel]="dateValue()"
            (ngModelChange)="dateValue.set($event)"
            label="Date Picker"
          >
          </wdc-date-input>`),
      ts: dedent(`
        import { Component } from '@angular/core';
        import { ColorInputComponent, DateInputComponent, FormsModule } from '${AppSetting.libName}';        
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [ColorInputComponent, DateInputComponent, FormsModule],
        })
        export class ExampleComponent {
          colorValue = signal('');
          dateValue = signal('');
        }`),
    },
    range: {
      html: dedent(`<wdc-range-input
            [ngModel]="rangeValue()"
            (ngModelChange)="rangeValue.set($event)"
            label="Range Slider"
            min="0"
            max="100"
            step="1"
            unit="%"
          >
          </wdc-range-input>`),
      ts: dedent(`
        import { Component } from '@angular/core';
        import { RangeInputComponent, FormsModule } from '${AppSetting.libName}';        
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [RangeInputComponent, FormsModule],
        })
        export class ExampleComponent {
          rangeValue = signal(0);
        }`),
    },
    markdown: {
      html: dedent(`<wdc-markdown-editor
            [ngModel]="markDownEditor()"
            (ngModelChange)="markDownEditor.set($event)"
            label="Markdown Content"
          >
          </wdc-markdown-editor>`),
      ts: dedent(`
        import { Component } from '@angular/core';
        import { MarkdownEditorComponent, FormsModule } from '${AppSetting.libName}';        
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [MarkdownEditorComponent, FormsModule],
        })
        export class ExampleComponent {
          markDownEditor = signal(0);
        }`),
    },
  };
}
