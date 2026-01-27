import { Component, input } from '@angular/core';

export interface ReferenceItem {
  input: string;
  type: string;
  default: string;
  description: string;
}

@Component({
  selector: 'app-reference',
  imports: [],
  templateUrl: './reference.component.html',
})
export class ReferenceComponent {
  data = input<ReferenceItem[]>([]);
}
