'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function RevenueChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Hoa hồng',
          'Hoa loa kèn',
          'Hoa cúc',
          'Hoa lan',
          'Hoa mẫu đơn',
          'Hoa cánh bướm'
        ],
        datasets: [
          {
            label: 'Doanh thu (triệu đ)',
            data: [45, 52, 38, 61, 55, 48],
            backgroundColor: [
              '#ec4899',
              '#f97316',
              '#eab308',
              '#22c55e',
              '#0ea5e9',
              '#a855f7'
            ],
            borderRadius: 8,
            borderWidth: 0
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#64748b',
              font: { size: 14, weight: 600 },
              padding: 20
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#94a3b8', font: { size: 12 } },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          y: {
            ticks: { color: '#94a3b8', font: { size: 12 } },
            grid: { display: false }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
        Doanh thu theo loại hoa
      </h2>
      <canvas ref={canvasRef} height="250" />
    </div>
  );
}
