export interface GalleryImage {
  thumbnailSrc: string; // Small image for the grid
  fullSrc: string; // High-res image for the viewer
  alt?: string; // Accessibility text
  id?: string | number; // Optional unique identifier
}
