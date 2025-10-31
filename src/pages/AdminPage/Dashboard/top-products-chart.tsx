'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function TopProductsChart() {
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
      type: 'doughnut',
      data: {
        labels: [
          'Hoa hồng đỏ',
          'Hoa loa kèn vàng',
          'Hoa cúc trắng',
          'Hoa lan tím',
          'Khác'
        ],
        datasets: [
          {
            data: [28, 22, 18, 15, 17],
            backgroundColor: [
              '#ec4899',
              '#f97316',
              '#fbbf24',
              '#a855f7',
              '#cbd5e1'
            ],
            borderColor: '#fff',
            borderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#64748b',
              font: { size: 13, weight: 600 },
              padding: 15,
              usePointStyle: true
            }
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
        Sản phẩm bán chạy
      </h2>
      <div className="flex justify-center">
        <canvas ref={canvasRef} width="280" height="280" />
      </div>
    </div>
  );
}
