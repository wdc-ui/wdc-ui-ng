import { Component, inject } from '@angular/core';
import { AppSetting } from '@shared/constants/app.constant';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { dedent } from '@shared/utils/dedent';
import { BREADCRUMB_COMPONENTS, BreadcrumbItem } from '@wdc-ui/ng/breadcrumb/breadcrumb.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { NoteBlockComponent } from '@shared/components/note-block/note-block.component';
import { MarkdownViewerComponent } from '@shared/components/markdown-viewer/markdown-viewer.component';
import { TocService } from 'src/app/core/services/toc.service';

@Component({
  selector: 'wdc-breadcrumb-example',
  imports: [UiConfig, BREADCRUMB_COMPONENTS, NoteBlockComponent, MarkdownViewerComponent],
  templateUrl: './breadcrumb-example.html',
})
export class BreadcrumbExample {
  private tocService = inject(TocService);

  ngOnInit() {
    // Manually define the headings for this page
    this.tocService.setToc([
      { id: 'installation', title: 'Installation', level: 'h2' },
      { id: 'examples', title: 'Examples', level: 'h2' },
      { id: 'references', title: 'API References', level: 'h2' },
    ]);
  }

  markdownData = `
    ### SEO Optimized Structure
    This component uses the following:

    - \`<nav>\` element
    - \`aria-label="breadcrumb"\`
    - \`ol\` list for **Rich Snippets**.

    Check out [Google Search Central](https://developers.google.com/search) for more details.
`;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Settings', url: '/dashboard/settings' },
    { label: 'Profile' }, // No URL = Active Page
  ];

  references: ReferenceItem[] = [
    {
      input: 'items',
      type: 'BreadcrumbItem[]',
      default: '[]',
      description: 'Array of data to generate breadcrumbs automatically.',
    },
    {
      input: 'class',
      type: 'string',
      default: "''",
      description: 'Custom classes for the nav container.',
    },
    {
      input: 'url',
      type: 'string',
      default: 'undefined',
      description: 'The router link. If omitted, renders as active text (current page).',
    },
    {
      input: 'target',
      type: 'string',
      default: "'_self'",
      description: 'Target attribute for the link.',
    },
  ];

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} breadcrumb`),
    basic: {
      html: dedent(`
      <wdc-breadcrumb>
        <wdc-breadcrumb-item url="/">Home</wdc-breadcrumb-item>
        <wdc-breadcrumb-separator />
        <wdc-breadcrumb-item url="/components">Components</wdc-breadcrumb-item>
        <wdc-breadcrumb-separator />
        <wdc-breadcrumb-item>Breadcrumb</wdc-breadcrumb-item>
      </wdc-breadcrumb>`),
      ts: `import { BREADCRUMB_COMPONENTS } from '@wdc-ui/components';`,
    },
    customSeparator: {
      html: dedent(`
      <wdc-breadcrumb>
        <wdc-breadcrumb-item url="/">Home</wdc-breadcrumb-item>
        
        <wdc-breadcrumb-separator>
           <span class="text-muted-foreground">/</span>
        </wdc-breadcrumb-separator>
        
        <wdc-breadcrumb-item url="/docs">Docs</wdc-breadcrumb-item>
        
        <wdc-breadcrumb-separator>
           <span class="text-muted-foreground">/</span>
        </wdc-breadcrumb-separator>
        
        <wdc-breadcrumb-item>Slash</wdc-breadcrumb-item>
      </wdc-breadcrumb>`),
      ts: ``,
    },
    dataDriven: {
      html: dedent(`<wdc-breadcrumb [items]="breadcrumbs" />`),
      ts: dedent(`
      breadcrumbs = [
        { label: 'Home', url: '/' },
        { label: 'Products', url: '/products' },
        { label: 'Electronics', url: '/products/electronics' },
        { label: 'Laptops' } // No URL = Active Page
      ]`),
    },
  };
}
