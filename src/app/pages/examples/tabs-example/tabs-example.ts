import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSetting } from '@shared/constants/app.constant';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { dedent } from '@shared/utils/dedent';
import { TABS_COMPONENTS } from '@wdc-ui/ng/tabs/tabs.component';
import { CARD_COMPONENTS } from '@wdc-ui/ng/card/card.component';
import { TocService } from 'src/app/core/services/toc.service';

@Component({
  selector: 'app-tabs-example',
  standalone: true,
  imports: [CommonModule, TABS_COMPONENTS, CARD_COMPONENTS, UiConfig],
  templateUrl: './tabs-example.html',
})
export class TabsExample {
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

  activeTabIndex = 0;
  htmlCode = `
<wdc-tabs>
    <wdc-tab-panel header="Tab 1">
        Content 1
    </wdc-tab-panel>
    <wdc-tab-panel header="Tab 2">
        Content 2
    </wdc-tab-panel>
</wdc-tabs>

<wdc-tabs orientation="vertical">
    <wdc-tab-panel header="Tab A">
        Content A
    </wdc-tab-panel>
</wdc-tabs>
    `;

  tsCode = `
import { TabsComponent, TabPanelComponent } from 'wdc';
    `;
  references: ReferenceItem[] = [];

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} tabs`),
    html: dedent(`<wdc-tabs>
            <wdc-tab
              [active]="true"
              [headerTemplate]="accountTabHeader"
              [contentTemplate]="accountTabContent"
            >
              <ng-template #accountTabHeader> Account </ng-template>
              <ng-template #accountTabContent>
                <div class="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div class="p-4 bg-gray-50 rounded-lg">
                    <h4 class="font-medium text-gray-900">Account Content</h4>
                    <p class="text-sm text-gray-500 mt-1">Manage your account details here.</p>
                  </div>
                </div>
              </ng-template>
            </wdc-tab>
            <wdc-tab label="Password" [contentTemplate]="passTabContent">
              <ng-template #passTabContent>
                <div class="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div class="p-4 bg-gray-50 rounded-lg">
                    <h4 class="font-medium text-gray-900">Password Content</h4>
                    <p class="text-sm text-gray-500 mt-1">Change your password here.</p>
                  </div>
                </div>
              </ng-template>
            </wdc-tab>
          </wdc-tabs>`),
    ts: dedent(`
            import { Component } from '@angular/core';
            import { TabsComponent, TabComponent } from '${AppSetting.libName}';
            @Component({
                selector: 'app-example',
                standalone: true,
                imports: [TabsComponent, TabComponent],
            })
            export class ExampleComponent {}`),
  };
}
