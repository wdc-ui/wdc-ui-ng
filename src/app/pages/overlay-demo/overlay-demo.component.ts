import { Component } from '@angular/core';
import { CollapsibleDirective } from '@shared/directives/collapsible.directive';
import { CopyClipboardDirective } from '@shared/directives/copy-clipboard.directive';
import { ButtonComponent } from '@wdc-ui/ng/button/button.component';
import { InputComponent } from '@wdc-ui/ng/forms/input/input.component';
import { IconComponent } from '@wdc-ui/ng/icon/icon.component';
import { ScrollTopComponent } from '@wdc-ui/ng/scroll-top/scroll-top.component';
import { PopoverComponent, PopoverTriggerDirective } from '@wdc-ui/ng/tooltip/popover.component';
import { TooltipDirective } from '@wdc-ui/ng/tooltip/tooltip.directive';

@Component({
  selector: 'app-overlay-demo',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    TooltipDirective,
    PopoverComponent,
    PopoverTriggerDirective,
    CollapsibleDirective,
    IconComponent,
    CopyClipboardDirective,
    ScrollTopComponent,
  ],
  template: `
    <div class="p-12 space-y-12">
      <section class="space-y-4">
        <h2 class="text-xl font-bold">1. Tooltips</h2>
        <div class="flex gap-4">
          <wdc-button wdcTooltip="Add to cart" position="top"> Top Tooltip </wdc-button>

          <wdc-button variant="outline" wdcTooltip="User Settings" position="right">
            Right Tooltip
          </wdc-button>

          <wdc-button variant="ghost" wdcTooltip="Delete Item" position="bottom">
            Bottom Tooltip
          </wdc-button>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-xl font-bold">2. Popovers</h2>

        <wdc-button [wdcPopoverTrigger]="myPopover" position="right">
          Open Edit Settings
        </wdc-button>

        <wdc-popover #myPopover>
          <div class="space-y-3">
            <h4 class="font-medium leading-none">Dimensions</h4>
            <p class="text-xs text-muted-foreground">Set the dimensions for the layer.</p>

            <div class="grid gap-2">
              <div class="grid grid-cols-3 items-center gap-4">
                <label class="text-xs">Width</label>
                <input class="col-span-2 h-8 rounded-md border px-2 text-xs" value="100%" />
              </div>
              <div class="grid grid-cols-3 items-center gap-4">
                <label class="text-xs">Height</label>
                <input class="col-span-2 h-8 rounded-md border px-2 text-xs" value="25px" />
              </div>
            </div>
          </div>
        </wdc-popover>
      </section>

      <button (click)="expanded = !expanded">Toggle</button>

      <div [wdcCollapsible]="expanded">
        <div class="overflow-hidden min-h-0">
          <p>Your hidden content here...</p>
          <p>More content...</p>
        </div>
      </div>

      <button [wdcCopy]="'API_KEY_12345'" #copyRef="wdcCopy" class="flex items-center gap-2">
        @if (copyRef.copied()) {
          <wdc-icon name="check" class="text-green-500" />
          <span>Copied!</span>
        } @else {
          <wdc-icon name="content_copy" />
          <span>Copy Key</span>
        }
      </button>

      <wdc-scroll-top></wdc-scroll-top>
    </div>
  `,
})
export class OverlayDemoComponent {
  expanded = false;
}
