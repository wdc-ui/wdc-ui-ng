import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiConfig } from '@shared/components/ui.config';
import { AppSetting } from '@shared/constants/app.constant';
import { dedent } from '@shared/utils/dedent';
import { ReferenceItem } from '@shared/components/ui.config';
import { RadioGroupComponent, RadioItemComponent } from '@wdc-ui/ng/radio/radio.component';

@Component({
  selector: 'app-radio-input-example',
  imports: [UiConfig, RadioGroupComponent, RadioItemComponent, FormsModule, CommonModule],
  templateUrl: './radio-input-example.html',
})
export class RadioInputExample {
  radioValue = 'free';
  radioOptions = [
    { label: 'Radio Option 1', value: 'opt1' },
    { label: 'Radio Option 2', value: 'opt2' },
    { label: 'Radio Option 3', value: 'opt3' },
  ];
  references: ReferenceItem[] = [
    {
      input: 'options',
      type: '{ label: string; value: any }[]',
      default: 'undefined',
      description: 'Options for the radio input field.',
    },
    {
      input: 'ngModel',
      type: 'any',
      default: 'undefined',
      description: 'Value of the radio input field.',
    },
    {
      input: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether the radio input field is disabled.',
    },
    {
      input: 'name',
      type: 'string',
      default: 'undefined',
      description: 'Name of the radio input field.',
    },
  ];

  snippets = {
    install: dedent(`${AppSetting.addComponentCmd} radio`),
    html: dedent(`<wdc-radio-group [(ngModel)]="radioValue">
            <wdc-radio-item value="free">Free Plan</wdc-radio-item>
            <wdc-radio-item value="pro">Pro Plan - $10</wdc-radio-item>
            <wdc-radio-item value="enterprise">Enterprise</wdc-radio-item>
          </wdc-radio-group>`),
    ts: dedent(`
        import { Component } from '@angular/core';
        import { FormsModule } from '@angular/forms';
        import {
          RadioGroupComponent,
          RadioItemComponent,
        } from '${AppSetting.libName}/forms/radio/radio.component';
        @Component({
            selector: 'app-example',
            standalone: true,
            imports: [RadioGroupComponent, RadioItemComponent, FormsModule],
        })
        export class ExampleComponent {  
          radioValue = 'free';
        }`),
  };
}
