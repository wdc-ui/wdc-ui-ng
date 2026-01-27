import { Component, input, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeViewerComponent } from '../code-viewer/code-viewer.component';
import {
  CardComponent,
  CardContentComponent,
  CardDescriptionComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from '@wdc-ui/ng/card/card.component';
import { ToastService } from '@wdc-ui/ng/toast/toast.service';

@Component({
  selector: 'app-doc-preview',
  imports: [
    CommonModule,
    CardComponent,
    CodeViewerComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
  ],
  templateUrl: './doc-preview.component.html',
})
export class DocPreviewComponent {
  title = input.required<string>();
  description = input<string>('');
  showCode = input<boolean>(true);
  htmlCode = input<string>('');
  tsCode = input<string>('');

  activeTab = signal<'preview' | 'code'>('preview');

  private toastService = inject(ToastService);

  copyCode() {
    // navigator.clipboard.writeText(this.code()).then(() => {
    //   this.toastService.success('Code copied to clipboard!');
    // });
  }
}
