import { Component, signal } from '@angular/core';
import { ReferenceItem, UiConfig } from '@shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { PaginationComponent } from '@wdc-ui/ng/pagination/pagination.component';

@Component({
  selector: 'wdc-pagination-example',
  imports: [IconComponent, UiConfig, PaginationComponent],
  templateUrl: './pagination-example.html',
})
export class PaginationExample {
  page = signal(1);
  pageSmall = signal(2);

  references: ReferenceItem[] = [
    {
      input: 'src',
      type: 'string',
      default: 'undefined',
      description: 'Image source URL.',
    },
    {
      input: 'size',
      type: `'sm' | 'md' | 'lg' | 'xl'`,
      default: `'md'`,
      description: 'Size of the avatar.',
    },
    {
      input: 'shape',
      type: `'circle' | 'square'`,
      default: `'circle'`,
      description: 'Shape of the avatar.',
    },
    {
      input: 'fallback',
      type: 'string',
      default: 'undefined',
      description: 'Fallback text to display when image is not available.',
    },
    {
      input: 'alt',
      type: 'string',
      default: 'undefined',
      description: 'Alternative text for the image.',
    },
  ];
  snippets = {
    html: dedent(`<wdc-dropdown>
            <wdc-avatar-profile
              wdcDropdownTrigger
              name="Kamal Singh"
              email="kamal@wdcoders.com"
              status="online"
              size="default"
              shape="circle"
            ></wdc-avatar-profile>

            <wdc-dropdown-content class="w-56" align="end">
              <wdc-dropdown-label>My Account</wdc-dropdown-label>
              <wdc-dropdown-separator />

              <wdc-dropdown-item icon="person" shortcut="⇧⌘P"> Profile </wdc-dropdown-item>
              <wdc-dropdown-item icon="credit_card" shortcut="⌘B"> Billing </wdc-dropdown-item>
              <wdc-dropdown-item icon="settings" shortcut="⌘S"> Settings </wdc-dropdown-item>

              <wdc-dropdown-separator />

              <wdc-dropdown-item icon="logout" class="text-destructive focus:text-destructive">
                Log out
              </wdc-dropdown-item>
            </wdc-dropdown-content>
          </wdc-dropdown>
          
          <wdc-dropdown>
            <wdc-button wdcDropdownTrigger variant="ghost" [icon]="true" class="rounded-full">
              <wdc-icon name="more_vert" />
            </wdc-button>

            <wdc-dropdown-content align="end">
              <wdc-dropdown-item (click)="edit()"> Edit </wdc-dropdown-item>
              <wdc-dropdown-item (click)="duplicate()"> Duplicate </wdc-dropdown-item>
              <wdc-dropdown-separator />
              <wdc-dropdown-item (click)="delete()" class="text-red-600 hover:text-red-600">
                Delete
              </wdc-dropdown-item>
            </wdc-dropdown-content>
          </wdc-dropdown>`),
    ts: dedent(`
        import { Component } from '@angular/core';
        import { AvatarComponent } from '${AppSetting.libName}';
        import { AvatarProfileComponent } from '${AppSetting.libName}/avatar/avatar-profile.component';
        import { AVATAR_COMPONENTS } from '${AppSetting.libName}/avatar/avatar.component';
        import { DROPDOWN_MENU_COMPONENTS } from '${AppSetting.libName}/dropdown-menu/dropdown-menu.component';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [AvatarComponent],
        })
        export class ExampleComponent {
          edit() {
            console.log('Edit clicked');
          }
          duplicate() {
            console.log('Duplicate clicked');
          }
          delete() {
            console.log('Delete clicked');
          }
        }`),
  };
}
