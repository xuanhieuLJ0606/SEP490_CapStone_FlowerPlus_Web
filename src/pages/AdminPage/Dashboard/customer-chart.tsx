'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function CustomerChart() {
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
      type: 'radar',
      data: {
        labels: [
          'Khách mới',
          'Khách thường xuyên',
          'Khách VIP',
          'Khách online',
          'Khách cũ'
        ],
        datasets: [
          {
            label: 'Số lượng khách hàng',
            data: [65, 78, 45, 82, 55],
            borderColor: '#ec4899',
            backgroundColor: 'rgba(236, 72, 153, 0.15)',
            borderWidth: 2,
            fill: true,
            pointBackgroundColor: '#ec4899',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5
          }
        ]
      },
      options: {
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
          r: {
            ticks: { color: '#94a3b8', font: { size: 12 } },
            grid: { color: 'rgba(148, 163, 184, 0.2)' }
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
        Phân loại khách hàng
      </h2>
      <canvas ref={canvasRef} />
    </div>
  );
}
