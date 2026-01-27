import {
  Component,
  input,
  signal,
  forwardRef,
  ChangeDetectionStrategy,
  ElementRef,
  viewChild,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

// Assumes Quill is loaded globally (CDN or angular.json scripts)
declare const Quill: any;

@Component({
  selector: 'wdc-rich-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
  // Encapsulation None is needed to style Quill internals with Tailwind
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="w-full space-y-1.5">
      @if (label()) {
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          [class.text-danger]="error()"
        >
          {{ label() }}
          @if (required()) {
            <span class="text-danger">*</span>
          }
        </label>
      }

      <div
        class="group relative w-full rounded-md border bg-background transition-colors focus-within:ring-1 focus-within:ring-ring"
        [class.border-input]="!error()"
        [class.border-danger]="error()"
        [class.focus-within:border-danger]="error()"
        [class.focus-within:ring-danger]="error()"
        [class.opacity-50]="disabled()"
      >
        <div #editorContainer class="min-h-[150px] font-sans text-sm"></div>
      </div>

      @if (error()) {
        <p class="text-[0.8rem] font-medium text-danger animate-in slide-in-from-top-1">
          {{ error() }}
        </p>
      } @else if (hint()) {
        <p class="text-[0.8rem] text-muted-foreground">{{ hint() }}</p>
      }
    </div>
  `,
  styles: [
    `
      /* --- QUILL OVERRIDES FOR TAILWIND --- */
      /* Remove default Quill borders so our wrapper controls the border */
      .ql-toolbar.ql-snow {
        border: none !important;
        border-bottom: 1px solid hsl(var(--border)) !important;
        border-top-left-radius: calc(var(--radius) - 2px);
        border-top-right-radius: calc(var(--radius) - 2px);
        background-color: hsl(var(--muted) / 0.3);
      }
      .ql-container.ql-snow {
        border: none !important;
        border-bottom-left-radius: calc(var(--radius) - 2px);
        border-bottom-right-radius: calc(var(--radius) - 2px);
      }

      /* Fix Lists inside Editor (Tailwind resets them) */
      .ql-editor ol {
        list-style-type: decimal;
        padding-left: 1.5em;
      }
      .ql-editor ul {
        list-style-type: disc;
        padding-left: 1.5em;
      }

      /* Fix Font Sizes */
      .ql-editor {
        font-size: 0.875rem; /* text-sm */
        min-height: 150px;
      }
      .ql-editor.ql-blank::before {
        color: hsl(var(--muted-foreground));
        font-style: normal;
      }
    `,
  ],
})
export class RichTextEditorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  // --- INPUTS ---
  label = input<string>('');
  placeholder = input<string>('Write something amazing...');
  error = input<string | null>(null);
  hint = input<string | null>(null);
  required = input<boolean>(false);

  // --- VIEW CHILD ---
  editorContainer = viewChild<ElementRef>('editorContainer');

  // --- STATE ---
  quill: any;
  value = signal<string>('');
  disabled = signal<boolean>(false);

  // --- CVA CALLBACKS ---
  onChange = (value: string) => {};
  onTouched = () => {};

  ngAfterViewInit() {
    if (typeof Quill === 'undefined') {
      console.error(
        'Quill library not loaded. Make sure to add quill.js to your angular.json scripts or CDN.',
      );
      return;
    }

    const element = this.editorContainer()?.nativeElement;
    if (!element) return;

    // 1. Initialize Quill
    this.quill = new Quill(element, {
      theme: 'snow',
      placeholder: this.placeholder(),
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'clean'], // removed image for simplicity, add back if needed
        ],
      },
    });

    // 2. Handle Text Change (ngModel Change)
    this.quill.on('text-change', () => {
      const html = element.querySelector('.ql-editor').innerHTML;
      // If empty, set to null so 'required' validation works properly
      const value = html === '<p><br></p>' || html === '' ? '' : html;

      this.value.set(value);
      this.onChange(value);
    });

    // 3. Handle Selection Change (Blur / Touch)
    // Quill doesn't have a direct 'blur' event. We check selection range.
    this.quill.on('selection-change', (range: any, oldRange: any, source: string) => {
      if (range === null && oldRange !== null) {
        // User clicked away
        this.onTouched();
      }
    });

    // 4. Set Initial Value
    if (this.value()) {
      this.quill.clipboard.dangerouslyPasteHTML(this.value());
    }

    // 5. Set Initial Disabled State
    if (this.disabled()) {
      this.quill.enable(false);
    }
  }

  ngOnDestroy() {
    // Cleanup if necessary
  }

  // --- CVA IMPLEMENTATION ---

  writeValue(value: string): void {
    const val = value || '';
    this.value.set(val);

    if (this.quill) {
      // Only update if content is different to prevent cursor jumping
      const currentHTML =
        this.editorContainer()?.nativeElement.querySelector('.ql-editor').innerHTML;
      if (val !== currentHTML) {
        this.quill.clipboard.dangerouslyPasteHTML(val);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    if (this.quill) {
      this.quill.enable(!isDisabled);
    }
  }
}
