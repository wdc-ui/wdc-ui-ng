import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppSetting } from '@shared/constants/app.constant';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { dedent } from '@shared/utils/dedent';
import { INPUT_COMPONENTS } from '@wdc-ui/ng/input/input.component';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from '@wdc-ui/ng/card/card.component';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { TocService } from 'src/app/core/services/toc.service';
import { NoteBlockComponent } from '@shared/components/note-block/note-block.component';
import { MarkdownViewerComponent } from '@shared/components/markdown-viewer/markdown-viewer.component';

@Component({
  selector: 'app-forms-example',
  standalone: true,
  imports: [
    UiConfig,
    FormsModule,
    CommonModule,
    CardComponent,
    CardTitleComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardFooterComponent,
    ButtonComponent,
    ReactiveFormsModule,
    IconComponent,
    INPUT_COMPONENTS,
    NoteBlockComponent,
    MarkdownViewerComponent,
  ],
  templateUrl: './text-input-example.html',
})
export class TextInputExample {
  private fb = inject(FormBuilder);
  private tocService = inject(TocService);
  email = 'input-value';
  username = 'wdcoders';

  isLoading = signal(false);

  // Form Definition with Validators
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    // Manually define the headings for this page
    this.tocService.setToc([
      { id: 'installation', title: 'Installation', level: 'h2' },
      { id: 'examples', title: 'Examples', level: 'h2' },
      { id: 'references', title: 'API References', level: 'h2' },
    ]);
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.loginForm.get(controlName);

    if (control?.touched && control?.errors) {
      if (control.errors['required'])
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
    }
    return null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      console.log('Form Data:', this.loginForm.value);

      // Simulate API Call
      setTimeout(() => {
        this.isLoading.set(false);
        alert('Login Successful!');
      }, 2000);
    } else {
      this.loginForm.markAllAsTouched(); // Trigger validation errors visually
    }
  }

  markdownData = `Using [id] on the input and [for] on the label ensures screen readers associate the label correctly. The aria-invalid and aria-describedby attributes help accessibility tools announce errors automatically.`;

  references: ReferenceItem[] = [
    {
      input: 'label',
      type: 'string',
      default: "''",
      description: 'Text label displayed above the input.',
    },
    {
      input: 'type',
      type: "'text' | 'email' | 'password' | 'number'",
      default: "'text'",
      description: 'HTML input type.',
    },
    {
      input: 'placeholder',
      type: 'string',
      default: "''",
      description: 'Placeholder text.',
    },
    {
      input: 'error',
      type: 'string | null',
      default: 'null',
      description: 'Error message text. Changes border color to red.',
    },
    {
      input: 'success',
      type: 'boolean',
      default: 'false',
      description: 'If true, changes border color to green.',
    },
    {
      input: 'hint',
      type: 'string | null',
      default: 'null',
      description: 'Helper text displayed below the input.',
    },
    {
      input: 'size',
      type: "'sm' | 'default' | 'lg'",
      default: "'default'",
      description: 'Controls the height and font size.',
    },
  ];

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} input`),
    basic: {
      html: dedent(`
      <div class="grid w-full max-w-sm items-center gap-4">
        <wdc-input label="Email" type="email" placeholder="Email" />
        <wdc-input label="Disabled" disabled placeholder="Disabled" />
      </div>`),
      ts: ``,
    },
    icons: {
      html: dedent(`
      <div class="grid w-full max-w-sm gap-4">
        <wdc-input label="Username" placeholder="Enter username">
          <wdc-icon wdcPrefix name="person" size="18" />
        </wdc-input>

        <wdc-input label="Amount" type="number" placeholder="0.00">
           <span wdcSuffix class="text-xs font-bold">USD</span>
        </wdc-input>
      </div>`),
      ts: dedent(`import { IconComponent } from '@wdc-ui/components';`),
    },
    validation: {
      html: dedent(`
      <div class="grid w-full max-w-sm gap-4">
        <wdc-input label="Email" error="Please enter a valid email." value="invalid-email" />
        <wdc-input label="Username" [success]="true" value="wdcoders" />
      </div>
    `),
      ts: ``,
    },
    password: {
      html: dedent(`
      <wdc-input 
        label="Password" 
        type="password" 
        placeholder="••••••••" 
      />
    `),
      ts: ``,
    },
    html: dedent(`<wdc-text-input
            [ngModel]="nameValue()"
            (ngModelChange)="nameValue.set($event)"
            label="Your Name"
            placeholder="Your Name"
          >
          </wdc-text-input>
          <wdc-text-input
            [ngModel]="emailValue()"
            (ngModelChange)="emailValue.set($event)"
            label="Email Address"
            type="email"
            placeholder="Email Address"
          >
          </wdc-text-input>
          <wdc-text-input
            [ngModel]="passwordValue()"
            (ngModelChange)="passwordValue.set($event)"
            label="Password"
            type="password"
            placeholder="Password"
          >
          </wdc-text-input>`),
    ts: dedent(`
        import { Component } from '@angular/core';
        import { FormsModule } from '@angular/forms';
        import { TextInputComponent } from '${AppSetting.libName}';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [TextInputComponent, FormsModule],
        })
        export class ExampleComponent {  
          nameValue = signal('');
          emailValue = signal('');
          passwordValue = signal('');
        }`),
  };
}
