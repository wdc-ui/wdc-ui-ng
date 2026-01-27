export * from './saparator/saparator.component';
export * from './doc-preview/doc-preview.component';
export * from './code-viewer/code-viewer.component';
export * from './reference/reference.component';

import { CodeViewerComponent } from './code-viewer/code-viewer.component';
import { DocPreviewComponent } from './doc-preview/doc-preview.component';
import { ReferenceComponent } from './reference/reference.component';
import { SaparatorComponent } from './saparator/saparator.component';

export const UiConfig = [
  SaparatorComponent,
  DocPreviewComponent,
  CodeViewerComponent,
  ReferenceComponent,
] as const;
