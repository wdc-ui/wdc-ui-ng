import { Injectable, signal } from '@angular/core';

export interface TocItem {
  id: string;
  title: string;
  level: 'h2' | 'h3';
}

@Injectable({
  providedIn: 'root',
})
export class TocService {
  // Signal to hold the current list of headings
  activeToc = signal<TocItem[]>([]);

  setToc(items: TocItem[]) {
    this.activeToc.set(items);
  }
}
