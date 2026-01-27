import { Component } from '@angular/core';
import { GalleryImage } from '@wdc-ui/ng/image-gallery/gallery.model';
import { ImageGalleryComponent } from '@wdc-ui/ng/image-gallery/image-gallery.component';

@Component({
  selector: 'app-gallery-demo',
  standalone: true,
  imports: [ImageGalleryComponent],
  template: `
    <div class="p-8 max-w-6xl mx-auto">
      <div class="mb-8">
        <h2 class="text-2xl font-bold tracking-tight">Project Gallery</h2>
        <p class="text-muted-foreground">Click on an image to view it in full screen.</p>
      </div>

      <wdc-image-gallery [images]="demoImages" />
    </div>
  `,
})
export class GalleryDemoComponent {
  // Sample Data using picsum.photos for varied sizes
  demoImages: GalleryImage[] = [
    {
      thumbnailSrc: 'https://picsum.photos/id/10/400/400',
      fullSrc: 'https://picsum.photos/id/10/2500/1667',
      alt: 'Misty mountains and forests',
    },
    {
      thumbnailSrc: 'https://picsum.photos/id/14/400/400',
      fullSrc: 'https://picsum.photos/id/14/2500/1667',
      alt: 'Coastal view with rocks',
    },
    {
      thumbnailSrc: 'https://picsum.photos/id/28/400/400',
      fullSrc: 'https://picsum.photos/id/28/4928/3264',
      alt: 'Forest path',
    },
    {
      thumbnailSrc: 'https://picsum.photos/id/49/400/400',
      fullSrc: 'https://picsum.photos/id/49/1280/792',
      alt: 'City skyline across water',
    },
    {
      thumbnailSrc: 'https://picsum.photos/id/54/400/400',
      fullSrc: 'https://picsum.photos/id/54/3264/2176',
      alt: 'Foggy mountains at sunrise',
    },
    {
      thumbnailSrc: 'https://picsum.photos/id/68/400/400',
      fullSrc: 'https://picsum.photos/id/68/4608/3072',
      alt: 'Aurora borealis',
    },
    {
      thumbnailSrc: 'https://picsum.photos/id/103/400/400',
      fullSrc: 'https://picsum.photos/id/103/2592/1936',
      alt: 'Feet dangling over edge',
    },
    {
      thumbnailSrc: 'https://picsum.photos/id/119/400/400',
      fullSrc: 'https://picsum.photos/id/119/3264/2176',
      alt: 'Laptop on desk',
    },
  ];
}
