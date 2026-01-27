import { Component } from '@angular/core';
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
  ],
  templateUrl: './card-example.html',
})
export class CardExample {
  AppSetting = AppSetting;
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
    stat: {
      html: dedent(`<wdc-stat-card
            label="Total Revenue"
            value="$128,450"
            [trend]="12.5"
            trendLabel="vs last month"
            iconName="money_bag"
          ></wdc-stat-card>
          <wdc-stat-card
            label="Total Orders"
            value="1,245"
            [trend]="8.2"
            trendLabel="vs last month"
            iconName="chart_data"
          ></wdc-stat-card>
          <wdc-stat-card
            label="Active Users"
            [value]="45"
            [trend]="-2.5"
            trendLabel="vs yesterday"
            iconName="group"
          ></wdc-stat-card>`),
      ts: dedent(`
          import { Component } from '@angular/core';
          import { StatCardComponent } from '${AppSetting.libName}';
          @Component({
              selector: 'app-example',
              standalone: true,
              imports: [StatCardComponent],
          })
          export class ExampleComponent {}`),
    },
  };
}
