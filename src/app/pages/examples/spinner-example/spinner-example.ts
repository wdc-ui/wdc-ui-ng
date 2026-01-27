import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { PageLoaderComponent } from '@wdc-ui/ng/page-loader/page-loader.component';
import { SpinnerComponent } from '@wdc-ui/ng/spinner/spinner.component';
import { AppSetting } from '@shared/constants/app.constant';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { dedent } from '@shared/utils/dedent';
import { PageLoaderService } from '@wdc-ui/ng/page-loader/page-loader.service';

@Component({
  selector: 'app-spinner-example',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, PageLoaderComponent, ButtonComponent, UiConfig],
  templateUrl: './spinner-example.html',
})
export class SpinnerExample {
  showPageLoader = signal(false);
  loader = inject(PageLoaderService);
  loaderMessage = signal('Loading your workspace...');

  triggerLoader() {
    this.showPageLoader.set(true);
    setTimeout(() => {
      this.showPageLoader.set(false);
    }, 3000);
  }

  triggerPageLoader() {
    this.loader.show();
    setTimeout(() => this.loader.hide(), 3000);
  }

  references: ReferenceItem[] = [
    {
      input: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Size of the spinner.',
    },
    {
      input: 'color',
      type: `'primary' | 'secondary' | 'white'`,
      default: `'primary'`,
      description: 'Color of the spinner.',
    },
  ];

  snippets = {
    html: dedent(`<wdc-spinner size="sm"></wdc-spinner>
          <wdc-spinner size="md"></wdc-spinner>
          <wdc-spinner size="lg"></wdc-spinner>
          <wdc-spinner color="primary" size="lg"></wdc-spinner>
          <div class="bg-slate-900 p-2 rounded-md">
            <wdc-spinner color="white" size="lg"></wdc-spinner>
          </div>`),
    ts: dedent(`
        import { Component } from '@angular/core';
        import { SpinnerComponent, PageLoaderComponent } from '${AppSetting.libName}';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [SpinnerComponent, PageLoaderComponent],
        })
        export class ExampleComponent {
            showPageLoader = signal(false);
            triggerLoader() {
                this.showPageLoader.set(true);
                setTimeout(() => this.showPageLoader.set(false), 3000);
            }
        }`),
  };
}
