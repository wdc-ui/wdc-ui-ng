import { AppSetting } from './../../../shared/constants/app.constant';
import { Component, inject } from '@angular/core';
import { dedent } from '../../../shared/utils/dedent';
import { UiConfig, ReferenceItem } from '../../../shared/components/ui.config';
import { AVATAR_COMPONENTS } from '@wdc-ui/ng/avatar/avatar.component';
import { AvatarProfileComponent } from '@wdc-ui/ng/avatar/avatar-profile.component';
import { BadgeComponent } from '@wdc-ui/ng/badge/badge.component';
import { TocService } from 'src/app/core/services/toc.service';

@Component({
  selector: 'app-avatar-example',
  standalone: true,
  imports: [AVATAR_COMPONENTS, AvatarProfileComponent, UiConfig, BadgeComponent],
  templateUrl: './avatar-example.html',
})
export class AvatarExample {
  private tocService = inject(TocService);
  imgUrl =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

  ngOnInit() {
    // Manually define the headings for this page
    this.tocService.setToc([
      { id: 'installation', title: 'Installation', level: 'h2' },
      { id: 'examples', title: 'Examples', level: 'h2' },
      { id: 'references', title: 'API References', level: 'h2' },
    ]);
  }
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
    install: dedent(`${AppSetting.addComponentCmd} avatar`),
    html: dedent(`<wdc-avatar size="sm" fallback="S"></wdc-avatar>
        <wdc-avatar size="md" fallback="M"></wdc-avatar>
        <wdc-avatar size="lg" fallback="L"></wdc-avatar>
        <wdc-avatar size="xl" fallback="XL"></wdc-avatar>
        <wdc-avatar shape="square" fallback="SQ"></wdc-avatar>
        <wdc-avatar src="{{imgUrl}}" fallback="JD"></wdc-avatar>`),
    ts: dedent(`
        import { Component } from '@angular/core';
        import { AvatarComponent } from '${AppSetting.libName}';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [AvatarComponent],
        })
        export class ExampleComponent {
          imgUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
        }`),
  };
}
