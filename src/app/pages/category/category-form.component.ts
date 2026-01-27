import { Component, input, output, effect, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@wdc-ui/ng/forms/input/input.component';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { SelectComponent } from '@wdc-ui/ng/select/select.component';
import { RichTextEditorComponent } from '@wdc-ui/ng/forms/rich-text-editor/rich-text-editor.component';
import { Category } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    RichTextEditorComponent,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
      <wdc-input
        label="Category Name"
        formControlName="name"
        placeholder="e.g. Electronics"
        [required]="true"
        [error]="getError('name')"
      />

      <wdc-input
        label="Slug"
        formControlName="slug"
        placeholder="e.g. electronics"
        [required]="true"
        [error]="getError('slug')"
      />

      <wdc-select
        label="Status"
        formControlName="status"
        [options]="statusOptions"
        [required]="true"
      />

      <wdc-rich-text-editor
        label="Description"
        formControlName="description"
        placeholder="Add category details..."
      />

      <div class="flex items-center justify-end gap-3 pt-4 border-t mt-4">
        <wdc-button type="button" variant="outline" (click)="onCancel.emit()"> Cancel </wdc-button>
        <wdc-button type="submit" [disabled]="form.invalid || form.pristine">
          {{ isEditMode() ? 'Update Category' : 'Create Category' }}
        </wdc-button>
      </div>
    </form>
  `,
})
export class CategoryFormComponent {
  private fb = inject(FormBuilder);

  // --- INPUTS & OUTPUTS ---
  initialData = input<Category | null>(null); // If null -> Create Mode
  onSave = output<Category>();
  onCancel = output<void>();

  // --- FORM CONFIG ---
  form = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(3)]],
    slug: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
    status: ['Active', Validators.required],
    description: [''],
  });

  statusOptions = ['Active', 'Inactive'];

  constructor() {
    // React to input changes (Open Edit Form)
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.patchValue(data);
      } else {
        this.form.reset({ status: 'Active' });
      }
    });
  }

  isEditMode() {
    return !!this.initialData();
  }

  getError(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.['required']) return `${controlName} is required`;
      if (control.errors?.['minlength']) return `Minimum 3 characters required`;
      if (control.errors?.['pattern']) return `Only lowercase letters and hyphens`;
    }
    return null;
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      // Emit data back to parent list
      this.onSave.emit(this.form.value as Category);
    }
  }
}
