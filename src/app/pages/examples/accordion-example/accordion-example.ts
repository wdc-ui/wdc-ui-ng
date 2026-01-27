import { Component } from '@angular/core';
import { AppSetting } from '@shared/constants/app.constant';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { dedent } from '@shared/utils/dedent';
import { ACCORDION_COMPONENTS } from '@wdc-ui/ng/accordion/accordion.component';

@Component({
  selector: 'app-accordion-example',
  imports: [ACCORDION_COMPONENTS, UiConfig],
  templateUrl: './accordion-example.html',
})
export class AccordionExample {
  references: ReferenceItem[] = [
    {
      input: 'open',
      type: 'boolean',
      default: 'false',
      description: 'Whether the accordion item is open or not.',
    },
    {
      input: 'noPaddingBody',
      type: 'boolean',
      default: 'false',
      description: 'Whether to remove padding from the accordion body.',
    },
    {
      input: 'customActions',
      type: 'boolean',
      default: 'false',
      description: 'Whether to display custom actions in the accordion header.',
    },
  ];

  snippets = {
    html: dedent(`<wdc-accordion>
            <wdc-accordion-item [open]="true">
              <div accordion-header>Accordion Item #1</div>
              <div accordion-body>Accordion Body #1</div>
            </wdc-accordion-item>
            <wdc-accordion-item>
              <div accordion-header>Accordion Item #2</div>
              <div accordion-body>Accordion Body #2</div>
            </wdc-accordion-item>
          </wdc-accordion>`),
    ts: dedent(`
        import { Component } from '@angular/core';
        import { AccordionComponent, AccordionItemComponent } from '${AppSetting.libName}';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [AccordionComponent, AccordionItemComponent],
        })
        export class ExampleComponent {}`),
  };
}
