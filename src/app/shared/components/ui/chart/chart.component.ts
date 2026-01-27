import { Component, input, computed, inject, PLATFORM_ID, signal, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'wdc-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="relative w-full h-full" [style.height]="height()" [style.width]="width()">
      @if (isBrowser()) {
        <canvas
          baseChart
          [data]="data()"
          [options]="defaultOptions()"
          [type]="type()"
          [plugins]="plugins()"
          [legend]="legend()"
        >
        </canvas>
      }
    </div>
  `,
})
export class ChartComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  // --- STATE ---
  isBrowser = signal(false);

  // --- INPUTS ---
  type = input.required<ChartType>();
  data = input.required<ChartData>();
  options = input<ChartOptions>({});
  plugins = input<any[]>([]);
  legend = input(true);

  height = input<string>('100%');
  width = input<string>('100%');

  // --- LIFECYCLE ---
  ngOnInit() {
    // Check if running on browser
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  // --- COMPUTED OPTIONS ---
  defaultOptions = computed(() => {
    const userOptions = this.options();
    return {
      responsive: true,
      maintainAspectRatio: false,
      ...userOptions,
      plugins: {
        legend: {
          display: this.legend(),
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: { family: 'inherit' },
          },
          ...userOptions.plugins?.legend,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          ...userOptions.plugins?.tooltip,
        },
        ...userOptions.plugins,
      },
    } as ChartOptions;
  });
}
