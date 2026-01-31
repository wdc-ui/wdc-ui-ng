import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dedent } from '@shared/utils/dedent';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { CheckboxComponent } from '@wdc-ui/ng/checkbox/checkbox.component';
import { AppSetting } from '@shared/constants/app.constant';
import { TocService } from 'src/app/core/services/toc.service';
import { NoteBlockComponent } from '@shared/components/note-block/note-block.component';
import { MarkdownViewerComponent } from '@shared/components/markdown-viewer/markdown-viewer.component';

@Component({
  selector: 'app-checkbox-input-example',
  imports: [
    UiConfig,
    CheckboxComponent,
    FormsModule,
    CommonModule,
    NoteBlockComponent,
    MarkdownViewerComponent,
  ],
  templateUrl: './checkbox-input-example.html',
})
export class CheckboxInputExample {
  private tocService = inject(TocService);
  AppSetting = AppSetting;

  ngOnInit() {
    // Manually define the headings for this page
    this.tocService.setToc([
      { id: 'installation', title: 'Installation', level: 'h2' },
      { id: 'examples', title: 'Examples', level: 'h2' },
      { id: 'references', title: 'API References', level: 'h2' },
    ]);
  }

  appleVal = false;
  orangeVal = true;
  bananaVal = true;
  references: ReferenceItem[] = [
    {
      input: 'label',
      type: 'string',
      default: 'undefined',
      description: 'Label text for the input field.',
    },
    {
      input: 'value',
      type: 'boolean',
      default: 'false',
      description: 'Value of the input field.',
    },
    {
      input: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether the input field is disabled.',
    },
  ];

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} checkbox`),
    html: dedent(`<wdc-checkbox [ngModel]="appleVal" label="Apple"></wdc-checkbox>
          <wdc-checkbox [ngModel]="orangeVal" label="Orange"></wdc-checkbox>
          <wdc-checkbox [ngModel]="bananaVal" label="Banana"></wdc-checkbox>`),
    ts: dedent(`
        import { Component } from '@angular/core';
        import { FormsModule } from '@angular/forms';
        import { CheckboxComponent } from '${AppSetting.libName}/forms/checkbox/checkbox.component';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [CheckboxComponent, FormsModule],
        })
        export class ExampleComponent {  
          appleVal = false;
          orangeVal = true;
          bananaVal = true;
        }`),
  };
}
