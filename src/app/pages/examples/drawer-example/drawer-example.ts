import { Component, signal } from '@angular/core';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import {
  DrawerComponent,
  DrawerDescriptionComponent,
  DrawerFooterComponent,
  DrawerHeaderComponent,
  DrawerTitleComponent,
} from '@wdc-ui/ng/drawer/drawer.component';

@Component({
  selector: 'app-drawer-example',
  standalone: true,
  imports: [
    DrawerComponent,
    ButtonComponent,
    UiConfig,
    DrawerHeaderComponent,
    DrawerFooterComponent,
    DrawerTitleComponent,
    DrawerDescriptionComponent,
  ],
  templateUrl: './drawer-example.html',
})
export class DrawerExample {
  isOpen = signal(false);
  activeSide = signal<'left' | 'right' | 'top' | 'bottom'>('right');

  openDrawer(side: 'left' | 'right' | 'top' | 'bottom') {
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
    html: dedent(`<wdc-button (click)="isLeftDrawerOpen = true">Left Drawer</wdc-button>
          <wdc-button (click)="isRightDrawerOpen = true">Right Drawer</wdc-button>`),
    ts: dedent(`
        import { Component } from '@angular/core';
        import { ButtonComponent, DrawerComponent } from '${AppSetting.libName}';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [ButtonComponent, DrawerComponent],
        })
        export class ExampleComponent {
          isLeftDrawerOpen = false;
          isRightDrawerOpen = false;
        }`),
  };
}
