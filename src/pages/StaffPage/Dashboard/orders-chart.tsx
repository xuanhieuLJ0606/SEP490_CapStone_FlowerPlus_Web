'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

interface OrdersChartProps {
  data: Array<{
    month: string;
    delivered?: number;
    delivering?: number;
    pending?: number;
    orderCount?: number;
  }>;
  showByStatus?: boolean;
}

export function OrdersChart({ data, showByStatus = false }: OrdersChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS<'line'> | null>(null);

  const formattedData = data.map((item) => ({
    ...item,
    month: new Date(item.month + '-01').toLocaleDateString('vi-VN', {
      month: 'short',
      year: 'numeric'
    })
  }));

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    const datasets = showByStatus
      ? [
          {
            label: 'Thành công',
            data: formattedData.map((item) => Number(item.delivered) || 0),
            borderColor: '#10b981',
            backgroundColor: '#10b98120',
            borderWidth: 2,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            tension: 0.4
          },
          {
            label: 'Đang giao',
            data: formattedData.map((item) => Number(item.delivering) || 0),
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f620',
            borderWidth: 2,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            tension: 0.4
          },
          {
            label: 'Đang chờ',
            data: formattedData.map((item) => Number(item.pending) || 0),
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b20',
            borderWidth: 2,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#f59e0b',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            tension: 0.4
          }
        ]
      : [
          {
            label: 'Đơn hàng',
            data: formattedData.map((item) => item.orderCount || 0),
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f620',
            borderWidth: 3,
            fill: true,
            pointRadius: 6,
            pointBackgroundColor: '#1e40af',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            tension: 0.4
          }
        ];

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: formattedData.map((item) => item.month),
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              color: textColor,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `Đơn hàng: ${context.parsed.y} đơn`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              color: textColor,
              callback: (value) => value.toString()
            },
            grid: {
              color: gridColor
            }
          },
          x: {
            ticks: {
              color: textColor
            },
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [formattedData]);

  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">
          {showByStatus ? 'Đơn hàng theo trạng thái' : 'Đơn hàng theo tháng'}
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          {showByStatus
            ? 'Thống kê đơn hàng theo trạng thái hàng tháng'
            : 'Số lượng đơn hàng bán được hàng tháng'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
