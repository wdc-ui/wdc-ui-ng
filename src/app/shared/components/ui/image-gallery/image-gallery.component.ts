import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { IconComponent } from '../icon/icon.component';
import { GalleryImage } from './gallery.model';

@Component({
  selector: 'wdc-image-gallery',
  standalone: true,
  imports: [CommonModule, ImageViewerComponent, IconComponent],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" [class]="gridClass()">
      @for (img of images(); track $index) {
        <div
          class="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
          (click)="openViewer(img)"
        >
          <img
            [src]="img.thumbnailSrc"
            [alt]="img.alt || 'Gallery image ' + ($index + 1)"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-0 transition-opacity"
            loading="lazy"
            (load)="$event.target.classList.remove('opacity-0')"
          />

          <div
            class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20 flex items-center justify-center"
          >
            <wdc-icon
              name="zoom_in"
              class="text-white opacity-0 transform scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
              size="32"
            />
          </div>
        </div>
      }
    </div>

    <wdc-image-viewer
      [open]="isViewerOpen()"
      (openChange)="onViewerOpenChange($event)"
      [src]="viewerSrc()"
      [alt]="viewerAlt()"
    />
  `,
})
export class ImageGalleryComponent {
  images = input.required<GalleryImage[]>();
  gridClass = input<string>('');

  selectedImage = signal<GalleryImage | null>(null);

  // Read-only computed signal
  isViewerOpen = computed(() => this.selectedImage() !== null);

  viewerSrc = computed(() => this.selectedImage()?.fullSrc || '');
  viewerAlt = computed(() => this.selectedImage()?.alt || '');

  openViewer(img: GalleryImage) {
    this.selectedImage.set(img);
  }

  // FIX: Handle closing by clearing the selected image
  onViewerOpenChange(isOpen: boolean) {
    if (!isOpen) {
      this.selectedImage.set(null);
    }
  }
}
