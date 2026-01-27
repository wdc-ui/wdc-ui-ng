import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartComponent } from '@wdc-ui/ng/chart/chart.component';

@Component({
  selector: 'app-chart-demo',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  template: `
    <div class="p-8 max-w-7xl mx-auto space-y-10">
      <div class="space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">Dashboard Analytics</h2>
        <p class="text-muted-foreground">Overview of system performance and metrics.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div class="flex flex-col space-y-1.5 mb-4">
            <h3 class="font-semibold leading-none tracking-tight">Revenue Growth</h3>
            <p class="text-sm text-muted-foreground">Monthly revenue for the current year</p>
          </div>
          <div class="h-[300px]">
            <wdc-chart type="line" [data]="lineChartData" [options]="lineChartOptions" />
          </div>
        </div>

        <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div class="flex flex-col space-y-1.5 mb-4">
            <h3 class="font-semibold leading-none tracking-tight">Sales by Category</h3>
            <p class="text-sm text-muted-foreground">Product performance breakdown</p>
          </div>
          <div class="h-[300px]">
            <wdc-chart type="bar" [data]="barChartData" [options]="barChartOptions" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 class="font-semibold mb-4">Traffic Sources</h3>
          <div class="h-[250px]">
            <wdc-chart type="doughnut" [data]="doughnutData" [options]="doughnutOptions" />
          </div>
        </div>

        <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 class="font-semibold mb-4">Developer Skills</h3>
          <div class="h-[250px]">
            <wdc-chart type="radar" [data]="radarData" />
          </div>
        </div>

        <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h3 class="font-semibold mb-4">Server Load</h3>
          <div class="h-[250px]">
            <wdc-chart type="polarArea" [data]="polarData" />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ChartDemoComponent {
  // --- 1. LINE CHART DATA ---
  lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        fill: true,
        tension: 0.4, // Smooth curves
        borderColor: '#6366f1', // Indigo
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#6366f1',
        pointHoverBackgroundColor: '#6366f1',
        pointHoverBorderColor: '#fff',
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Series B',
        fill: true,
        tension: 0.4,
        borderColor: '#10b981', // Emerald
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#10b981',
      },
    ],
  };

  lineChartOptions: ChartOptions = {
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, min: 0 },
    },
  };

  // --- 2. BAR CHART DATA ---
  barChartData: ChartData<'bar'> = {
    labels: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56],
        label: '2025 Sales',
        backgroundColor: '#3b82f6', // Blue
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        data: [28, 48, 40, 19, 86],
        label: '2024 Sales',
        backgroundColor: '#94a3b8', // Slate
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  barChartOptions: ChartOptions = {
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

  // --- 3. DOUGHNUT DATA ---
  doughnutData: ChartData<'doughnut'> = {
    labels: ['Direct', 'Social', 'Referral'],
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#f59e0b', '#ec4899', '#8b5cf6'], // Amber, Pink, Violet
        hoverOffset: 4,
      },
    ],
  };

  doughnutOptions: ChartOptions<'doughnut'> = {
    cutout: '70%', // Inner radius (makes it a ring)
    plugins: {
      legend: { position: 'right' }, // Optional: Move legend to right for doughnut
    },
  };

  // --- 4. RADAR DATA ---
  radarData: ChartData<'radar'> = {
    labels: ['Coding', 'Design', 'Communication', 'Management', 'Testing'],
    datasets: [
      {
        label: 'Candidate A',
        data: [65, 59, 90, 81, 56],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Candidate B',
        data: [28, 48, 40, 19, 96],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
      },
    ],
  };

  // --- 5. POLAR DATA ---
  polarData: ChartData<'polarArea'> = {
    labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    datasets: [
      {
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(201, 203, 207, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
      },
    ],
  };
}

// npm install chart.js ng2-charts
