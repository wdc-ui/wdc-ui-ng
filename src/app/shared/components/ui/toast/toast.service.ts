import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'dark' | 'light';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface Toast {
  id: number;
  message: string;
  description?: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
  closing?: boolean; // Animation exit handle karne ke liye
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(
    message: string,
    options?: {
      description?: string;
      type?: ToastType;
      position?: ToastPosition;
      duration?: number;
    },
  ) {
    const id = Date.now();
    const newToast: Toast = {
      id,
      message,
      description: options?.description,
      type: options?.type || 'light',
      position: options?.position || 'bottom-right',
      duration: options?.duration || 3000,
      closing: false,
    };

    this.toasts.update((current) => [...current, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => this.startRemove(id), newToast.duration);
    }
  }

  // 2-Step Removal for smooth Exit Animation
  startRemove(id: number) {
    this.toasts.update((current) =>
      current.map((t) => (t.id === id ? { ...t, closing: true } : t)),
    );

    // Wait for animation to finish (0.2s) then remove from DOM
    setTimeout(() => {
      this.toasts.update((current) => current.filter((t) => t.id !== id));
    }, 200);
  }
}
