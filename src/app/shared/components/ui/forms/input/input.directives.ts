import { Directive } from '@angular/core';

@Directive({
  selector: '[wdcPrefix]',
  standalone: true,
})
export class InputPrefixDirective {}

@Directive({
  selector: '[wdcSuffix]',
  standalone: true,
})
export class InputSuffixDirective {}
