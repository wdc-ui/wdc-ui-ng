import {
  Component,
  input,
  signal,
  forwardRef,
  computed,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@shared/utils/cn';
import { SpinnerComponent } from '../spinner/spinner.component'; // Ensure you have this

@Component({
  selector: 'wdc-file-upload',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileUploadComponent), multi: true },
  ],
  template: `
    <div class="w-full gap-1.5">
      @if (label()) {
        <label class="text-sm font-medium mb-2 block">{{ label() }}</label>
      }

      <div
        class="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-input p-6 transition-all hover:bg-accent/50 cursor-pointer"
        [class.border-primary]="isDragging()"
        [class.bg-accent]="isDragging()"
        [class.opacity-50]="isDisabled() || isUploading()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="triggerClick()"
      >
        <input
          #fileInput
          type="file"
          class="hidden"
          (change)="onFileSelect($event)"
          [accept]="accept()"
          [disabled]="isDisabled()"
        />

        @if (isUploading()) {
          <wdc-spinner size="lg" color="primary"></wdc-spinner>
          <p class="mt-2 text-sm text-muted-foreground">Uploading...</p>
        } @else if (fileName()) {
          <div class="flex flex-col items-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-primary mb-2"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p class="text-sm font-medium">{{ fileName() }}</p>
            <p class="text-xs text-muted-foreground mt-1">Click to replace</p>
          </div>
        } @else {
          <div class="flex flex-col items-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-muted-foreground mb-2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            <p class="text-sm font-medium">Drag & drop or click to upload</p>
            <p class="text-xs text-muted-foreground mt-1">
              Supported: {{ accept() || 'All files' }}
            </p>
          </div>
        }
      </div>
    </div>
  `,
})
export class FileUploadComponent implements ControlValueAccessor {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  label = input('');
  accept = input('*'); // e.g. '.png, .jpg'

  fileName = signal<string | null>(null);
  isDragging = signal(false);
  isDisabled = signal(false);
  isUploading = signal(false);

  onChange = (file: File | null) => {};
  onTouched = () => {};

  // -- Events --
  triggerClick() {
    if (!this.isDisabled()) this.fileInput.nativeElement.click();
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
    if (!this.isDisabled()) this.isDragging.set(true);
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
    if (this.isDisabled()) return;

    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      this.handleFile(e.dataTransfer.files[0]);
    }
  }

  handleFile(file: File) {
    // Simulate generic validation or upload logic here if needed
    this.fileName.set(file.name);
    this.onChange(file); // Return File object to form
    this.onTouched();
  }

  // CVA
  writeValue(value: any): void {
    // Usually file inputs don't accept initial values for security, but we can set filename
    if (value) this.fileName.set('Existing File (Hidden)');
    else this.fileName.set(null);
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
