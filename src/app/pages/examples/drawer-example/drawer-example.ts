import { Component, inject, OnInit, signal } from '@angular/core';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { DRAWER_COMPONENTS } from '@wdc-ui/ng/drawer/drawer.component';
import { InputComponent } from '@wdc-ui/ng/input/input.component';
import { SeoService } from 'src/app/core/services/seo.service';
import { TocService } from 'src/app/core/services/toc.service';

@Component({
  selector: 'app-drawer-example',
  standalone: true,
  imports: [ButtonComponent, UiConfig, DRAWER_COMPONENTS, InputComponent],
  templateUrl: './drawer-example.html',
})
export class DrawerExample implements OnInit {
  private seoSevice = inject(SeoService);
  private tocService = inject(TocService);
  isOpen = signal(false);
  activeSide = signal<'left' | 'right'>('right');

  ngOnInit() {
    this.seoSevice.updateMeta(
      'Angular Drawer Component',
      'High-performance, accessible side drawer for Angular 21. Fully customizable with SSR support.',
      'Angular Drawer, Sidebar, wdc-ui, Angular 21 SSR, Web Development',
    );
    this.tocService.setToc([
      { id: 'installation', title: 'Installation', level: 'h2' },
      { id: 'examples', title: 'Examples', level: 'h2' },
      { id: 'code', title: 'Code', level: 'h2' },
      { id: 'api', title: 'API Reference', level: 'h2' },
    ]);
  }

  openDrawer(side: 'left' | 'right') {
    this.activeSide.set(side);
    this.isOpen.set(true);
  }

  saveChanges() {
    console.log('Saving...');
    this.isOpen.set(false);
  }
  references: ReferenceItem[] = [
    {
      input: 'isOpen',
      type: 'boolean',
      default: 'false',
      description: 'Whether the sidebar is open or not.',
    },
    {
      input: 'position',
      type: `'left' | 'right'`,
      default: `'left'`,
      description: 'Position of the sidebar.',
    },
    {
      input: 'closeOnBackdropClick',
      type: 'boolean',
      default: 'true',
      description: 'Whether to close the sidebar when clicking on the backdrop.',
    },
    {
      input: 'close',
      type: 'void',
      default: 'undefined',
      description: 'Callback function to be called when the sidebar is closed.',
    },
  ];

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} drawer`),
    html: dedent(`<wdc-button (click)="openDrawer('right')" variant="outline">Open Right</wdc-button>
          <wdc-button (click)="openDrawer('left')" variant="outline">Open Left</wdc-button>
          
          <wdc-drawer [open]="isOpen()" [side]="activeSide()" (openChange)="isOpen.set(false)">
            <wdc-drawer-header>
              <wdc-drawer-title>Edit Profile</wdc-drawer-title>
              <wdc-drawer-description>Make changes to your profile here.</wdc-drawer-description>
            </wdc-drawer-header>

            <wdc-drawer-content>
              <div class="space-y-4">
                <wdc-input label="Name" value="Kamal Kumar" />
                <wdc-input label="Email" value="kamal@example.com" />
              </div>
            </wdc-drawer-content>

            <wdc-drawer-footer>
              <wdc-button variant="outline" (click)="isOpen.set(false)">Cancel</wdc-button>
              <wdc-button (click)="saveChanges()">Save Changes</wdc-button>
            </wdc-drawer-footer>
          </wdc-drawer>`),
    ts: dedent(`
        import { Component } from '@angular/core';
        import { ButtonComponent } from '${AppSetting.libName}/button/button.component';
        import { DRAWER_COMPONENTS } from '${AppSetting.libName}/drawer/drawer.component';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [ButtonComponent, DrawerComponent],
        })
        export class ExampleComponent {
          isOpen = signal(false);
          activeSide = signal<'left' | 'right'>('right');
          openDrawer(side: 'left' | 'right') {
            this.activeSide.set(side);
            this.isOpen.set(true);
          }
        }`),
  };
}
