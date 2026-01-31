import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSetting } from '@shared/constants/app.constant';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { dedent } from '@shared/utils/dedent';
import { stat } from 'fs';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
} from '@wdc-ui/ng/card/card.component';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { InputComponent } from '@wdc-ui/ng/input/input.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { NoteBlockComponent } from '@shared/components/note-block/note-block.component';
import { MarkdownViewerComponent } from '@shared/components/markdown-viewer/markdown-viewer.component';
import { TocService } from 'src/app/core/services/toc.service';

@Component({
  selector: 'app-card-example',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardContentComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleComponent,
    UiConfig,
    CardDescriptionComponent,
    ButtonComponent,
    InputComponent,
    IconComponent,
    NoteBlockComponent,
    MarkdownViewerComponent,
  ],
  templateUrl: './card-example.html',
})
export class CardExample {
  AppSetting = AppSetting;
  private tocService = inject(TocService);

  ngOnInit() {
    // Manually define the headings for this page
    this.tocService.setToc([
      { id: 'installation', title: 'Installation', level: 'h2' },
      { id: 'examples', title: 'Examples', level: 'h2' },
    ]);
  }

  htmlCode = `<wdc-card [header]="true" title="Simple Card" subtitle="With a subheader">
            <ng-container card-body>
              <p class="text-slate-600 text-sm dark:text-slate-400">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
                error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam
                nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
              </p>
            </ng-container>
          </wdc-card>
          <wdc-card
            [header]="true"
            [footer]="true"
            title="Simple Card"
            subtitle="With a subheader"
          >
            <ng-container card-body>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                You can insert images or custom content into the header slot. This card also has a
                footer with actions.
              </p>
            </ng-container>
            <div card-footer class="flex gap-2 justify-end">
              <wdc-button variant="light" size="sm">Cancel</wdc-button>
              <wdc-button size="sm">Save</wdc-button>
            </div>
          </wdc-card>
          <wdc-card>
            <div card-body class="flex flex-col items-center text-center space-y-4">
              <div
                class="p-3 mt-8 bg-indigo-50 dark:bg-indigo-500/10 rounded-full text-indigo-600 dark:text-indigo-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 class="font-semibold text-slate-900 dark:text-white">Task Completed</h3>
              <p class="text-sm text-slate-500">You have successfully finished the task.</p>
              <wdc-button class="w-full">Dashboard</wdc-button>
            </div>
          </wdc-card>`;

  tsCode = `import { CardComponent, StatCardComponent } from '${AppSetting.importPath}';`;

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} card`),
    basic: {
      html: dedent(`
      <div class="w-full max-w-sm">
        <wdc-card>
          <wdc-card-header>
            <wdc-card-title>Notifications</wdc-card-title>
            <wdc-card-description>You have 3 unread messages.</wdc-card-description>
          </wdc-card-header>
          
          <wdc-card-content>
            <div class="flex items-center gap-4 rounded-md border p-4">
              <wdc-icon name="bell" size="24" />
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium leading-none">Push Notifications</p>
                <p class="text-sm text-muted-foreground">Send notifications to device.</p>
              </div>
            </div>
          </wdc-card-content>
          
          <wdc-card-footer>
             <wdc-button class="w-full">Mark all as read</wdc-button>
          </wdc-card-footer>
        </wdc-card>
      </div>`),
      ts: `import { CARD_COMPONENTS } from '@wdc-ui/components';`,
    },
    login: {
      html: dedent(`
      <div class="w-full max-w-md">
        <wdc-card>
          <wdc-card-header>
            <wdc-card-title class="text-2xl">Login</wdc-card-title>
            <wdc-card-description>Enter your credentials to access your account.</wdc-card-description>
          </wdc-card-header>
          
          <wdc-card-content class="space-y-4">
            <wdc-input label="Email" type="email" placeholder="m@example.com" />
            <wdc-input label="Password" type="password" />
          </wdc-card-content>
          
          <wdc-card-footer class="flex justify-between">
            <wdc-button variant="ghost">Cancel</wdc-button>
            <wdc-button>Sign In</wdc-button>
          </wdc-card-footer>
        </wdc-card>
      </div>`),
      ts: ``,
    },
    simple: {
      html: dedent(`<wdc-card [header]="true" title="Simple Card" subtitle="With a subheader">
            <ng-container card-body>
              <p class="text-slate-600 text-sm dark:text-slate-400">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur
                error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam
                nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
              </p>
            </ng-container>
          </wdc-card>`),
      ts: dedent(`
          import { Component } from '@angular/core';
          import { CardComponent } from '${AppSetting.libName}';
          @Component({
              selector: 'app-example',
              standalone: true,
              imports: [CardComponent],
          })
          export class ExampleComponent {}`),
    },
    image: {
      html: dedent(`<wdc-card [noBodyPadding]="true">
            <ng-container card-body>
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Card Image"
                class="w-full h-48 object-cover rounded-t-xl"
              />
              <div class="p-6">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Image Card
                </h3>
                <p class="text-slate-600 text-sm dark:text-slate-400">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
                  consequuntur error repudiandae numquam deserunt quisquam repellat libero
                  asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                  quas!
                </p>
              </div>
            </ng-container>
          </wdc-card>
          <wdc-card [noBodyPadding]="true">
            <ng-container card-body>
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Card Image"
                class="w-full h-48 object-cover rounded-t-xl"
              />
              <div class="p-6">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Image Card
                </h3>
                <p class="text-slate-600 text-sm dark:text-slate-400">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
                  consequuntur error repudiandae numquam deserunt quisquam repellat libero
                  asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                  quas!
                </p>
                <div class="flex gap-2 mt-4">
                  <wdc-button size="sm" variant="link">Read More</wdc-button>
                </div>
              </div>
            </ng-container>
          </wdc-card>`),
      ts: dedent(`
          import { Component } from '@angular/core';
          import { CardComponent } from '${AppSetting.libName}';
          @Component({
              selector: 'app-example',
              standalone: true,
              imports: [CardComponent],
          })
          export class ExampleComponent {}`),
    },
    dashboard: {
      html: dedent(`
      <div class="grid gap-4 md:grid-cols-3 w-full">
        <wdc-card>
          <wdc-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
            <wdc-card-title class="text-sm font-medium">Total Revenue</wdc-card-title>
            <wdc-icon name="dollar_sign" size="16" class="text-muted-foreground" />
          </wdc-card-header>
          <wdc-card-content>
            <div class="text-2xl font-bold">$45,231.89</div>
            <p class="text-xs text-muted-foreground">+20.1% from last month</p>
          </wdc-card-content>
        </wdc-card>

        <wdc-card>
          <wdc-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
            <wdc-card-title class="text-sm font-medium">Subscriptions</wdc-card-title>
            <wdc-icon name="users" size="16" class="text-muted-foreground" />
          </wdc-card-header>
          <wdc-card-content>
            <div class="text-2xl font-bold">+2350</div>
            <p class="text-xs text-muted-foreground">+180.1% from last month</p>
          </wdc-card-content>
        </wdc-card>

        <wdc-card>
          <wdc-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
            <wdc-card-title class="text-sm font-medium">Active Now</wdc-card-title>
            <wdc-icon name="activity" size="16" class="text-muted-foreground" />
          </wdc-card-header>
          <wdc-card-content>
            <div class="text-2xl font-bold">+573</div>
            <p class="text-xs text-muted-foreground">+201 since last hour</p>
          </wdc-card-content>
        </wdc-card>

      </div>`),
      ts: ``,
    },
  };

  markdownData = `* **Structure:** Using \`wdc-card-title\` renders an \`<h3>\` by default, which creates a logical document structure for screen readers.
* **Landmark:** If a card represents a major standalone widget (like a pricing tier or a dashboard widget), consider adding \`role="region"\` or \`aria-labelledby\` pointing to the title ID.
* **Contrast:** The \`text-muted-foreground\` on the description ensures readability while establishing visual hierarchy without failing contrast ratios.`;
}
