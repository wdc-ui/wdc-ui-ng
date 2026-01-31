import {
  Component,
  input,
  signal,
  forwardRef,
  computed,
  ViewChild,
  ElementRef,
  booleanAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IconComponent } from '../icon/icon.component';

// --- DROPZONE STYLES ---
const dropzoneVariants = cva(
  'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      status: {
        default: 'border-input hover:bg-accent/50',
        error: 'border-danger bg-danger/5 text-danger hover:bg-danger/10',
        success: 'border-success bg-success/5 text-success hover:bg-success/10',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: 'cursor-pointer',
      },
      dragging: {
        true: 'border-primary bg-primary/5',
        false: '',
      },
    },
    defaultVariants: {
      status: 'default',
      disabled: false,
      dragging: false,
    },
  },
);

// --- INPUT STYLES (Matches wdc-input) ---
const inputVariants = cva(
  'relative flex w-full items-center gap-2 rounded-md border-2 bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:border-primary',
  {
    variants: {
      status: {
        default: 'border-input hover:bg-accent/50',
        error: 'border-danger text-danger',
        success: 'border-success text-success',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: 'cursor-pointer',
      },
      dragging: {
        true: 'border-primary bg-primary/5',
        false: '',
      },
    },
    defaultVariants: {
      status: 'default',
      disabled: false,
      dragging: false,
    },
  },
);

@Component({
  selector: 'wdc-file-upload',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full space-y-1.5">
      @if (label()) {
        <label
          class="text-sm font-medium leading-none block"
          [class.text-danger]="error()"
          [class.text-success]="!error() && success()"
        >
          {{ label() }}
          @if (required()) {
            <span class="text-danger ml-0.5">*</span>
          }
        </label>
      }

      <input
        #fileInput
        type="file"
        class="hidden"
        (change)="onFileSelect($event)"
        [accept]="accept()"
        [disabled]="isDisabled()"
      />

      @if (variant() === 'dropzone') {
        <div
          class="group"
          [class]="computedDropzoneClass()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="triggerClick()"
          (keydown.enter)="triggerClick()"
          (keydown.space)="triggerClick()"
          tabindex="0"
        >
          @if (isUploading()) {
            <div class="flex flex-col items-center animate-in fade-in">
              <wdc-spinner size="lg" class="text-primary"></wdc-spinner>
              <p class="mt-2 text-sm font-medium text-muted-foreground">Uploading...</p>
            </div>
          } @else if (fileName()) {
            <div class="flex flex-col items-center text-center animate-in zoom-in-95">
              <div class="mb-2 rounded-full bg-primary/10 p-2">
                <wdc-icon name="description" size="24" class="text-primary" />
              </div>
              <p class="text-sm font-medium truncate max-w-[200px]">{{ fileName() }}</p>
              <p class="text-xs text-muted-foreground mt-1">Click to replace</p>
            </div>
          } @else {
            <div class="flex flex-col items-center text-center">
              <div
                class="mb-2 rounded-full bg-muted p-2 transition-colors group-hover:bg-accent"
                [class.bg-danger-10]="error()"
                [class.bg-success-10]="success()"
              >
                <wdc-icon
                  name="cloud_upload"
                  size="24"
                  class="text-muted-foreground group-hover:text-foreground"
                  [class.text-danger]="error()"
                  [class.text-success]="!error() && success()"
                />
              </div>
              <p class="text-sm font-medium">
                <span class="text-primary underline-offset-4 group-hover:underline"
                  >Click to upload</span
                >
                or drag and drop
              </p>
              <p class="text-xs text-muted-foreground mt-1 uppercase">
                {{ accept() ? (accept() | slice: 0 : 30) : 'Any File' }}
              </p>
            </div>
          }
        </div>
      }

      @if (variant() === 'input') {
        <div
          [class]="computedInputClass()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="triggerClick()"
          (keydown.enter)="triggerClick()"
          (keydown.space)="triggerClick()"
          tabindex="0"
        >
          <wdc-icon name="attachment" size="16" class="text-muted-foreground shrink-0" />

          <span class="flex-1 truncate" [class.text-muted-foreground]="!fileName()">
            {{ fileName() || placeholder() }}
          </span>

          @if (isUploading()) {
            <wdc-spinner size="sm" class="text-primary" />
          } @else {
            <span
              class="shrink-0 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              Browse
            </span>
          }
        </div>
      }

      @if (error()) {
        <p class="text-[0.8rem] font-medium text-danger animate-in slide-in-from-top-1">
          {{ error() }}
        </p>
      } @else if (success()) {
        <p class="text-[0.8rem] font-medium text-success animate-in slide-in-from-top-1">
          {{ successMessage() }}
        </p>
      } @else if (hint()) {
        <p class="text-[0.8rem] text-muted-foreground">{{ hint() }}</p>
      }
    </div>
  `,
})
export class FileUploadComponent implements ControlValueAccessor {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // --- INPUTS ---
  label = input<string>('');
  accept = input<string>('');
  variant = input<'dropzone' | 'input'>('dropzone');
  placeholder = input<string>('Choose file...');

  error = input<string | null>(null);
  success = input<boolean | undefined>(false);
  successMessage = input<string>('File ready!');
  hint = input<string | null>(null);
  required = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });

  // --- STATE ---
  fileName = signal<string | null>(null);
  isDragging = signal(false);
  isDisabled = signal(false);
  isUploading = signal(false);

  // --- COMPUTED STYLES ---
  computedDropzoneClass = computed(() => {
    let currentStatus: 'default' | 'error' | 'success' = 'default';
    if (this.error()) currentStatus = 'error';
    else if (this.success()) currentStatus = 'success';

    return cn(
      dropzoneVariants({
        status: currentStatus,
        disabled: this.isDisabled() || this.disabled(),
        dragging: this.isDragging(),
      }),
    );
  });

  computedInputClass = computed(() => {
    let currentStatus: 'default' | 'error' | 'success' = 'default';
    if (this.error()) currentStatus = 'error';
    else if (this.success()) currentStatus = 'success';

    return cn(
      inputVariants({
        status: currentStatus,
        disabled: this.isDisabled() || this.disabled(),
        dragging: this.isDragging(),
      }),
    );
  });

  // --- EVENTS & CVA (Same as before) ---
  onChange = (file: File | null) => {};
  onTouched = () => {};

  triggerClick() {
    if (!this.isDisabled() && !this.disabled()) {
      this.fileInput.nativeElement.click();
    }
    this.onTouched();
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.isDisabled() && !this.disabled()) {
      this.isDragging.set(true);
    }
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging.set(false);
    if (this.isDisabled() || this.disabled()) return;

    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      this.handleFile(e.dataTransfer.files[0]);
    }
  }

  handleFile(file: File) {
    this.fileName.set(file.name);
    this.onChange(file);
  }

  writeValue(value: any): void {
    if (value && value.name) {
      this.fileName.set(value.name);
    } else if (value) {
      this.fileName.set('File Selected');
    } else {
      this.fileName.set(null);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.isDisabled.set(d);
  }
}
