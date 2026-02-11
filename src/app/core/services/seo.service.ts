import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  updateMeta(title: string, desc: string, keywords: string) {
    this.title.setTitle(`${title} | wdc-ui`);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ name: 'keywords', content: keywords });

    // Open Graph for Social Media (LinkedIn/Twitter)
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: desc });
  }
}
