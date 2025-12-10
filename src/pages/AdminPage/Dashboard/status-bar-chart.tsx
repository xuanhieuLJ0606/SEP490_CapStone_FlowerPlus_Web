'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatusBarChartProps {
  data: {
    successfulOrders: number;
    deliveringOrders: number;
    pendingOrders: number;
    failedOrders: number;
    refundedOrders: number;
  };
}

export function StatusBarChart({ data }: StatusBarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS<'bar'> | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: ['Thành công', 'Đang giao', 'Đang chờ', 'Đã hủy', 'Hoàn tiền'],
        datasets: [
          {
            label: 'Số đơn hàng',
            data: [
              data.successfulOrders,
              data.deliveringOrders,
              data.pendingOrders,
              data.failedOrders,
              data.refundedOrders
            ],
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(168, 85, 247, 0.8)'
            ],
            borderColor: [
              'rgb(16, 185, 129)',
              'rgb(59, 130, 246)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)',
              'rgb(168, 85, 247)'
            ],
            borderWidth: 2,
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                return `Số đơn: ${value}`;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            title: {
              display: true,
              text: 'Số đơn hàng',
              color: '#475569',
              font: { size: 12, weight: 'bold' }
            },
            ticks: {
              color: '#475569',
              stepSize: 1,
              callback: (value) => value.toString()
            },
            grid: {
              color: '#e2e8f0'
            }
          },
          x: {
            ticks: {
              color: '#475569',
              font: { size: 11, weight: 'bold' }
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
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>So sánh đơn hàng theo trạng thái</CardTitle>
        <CardDescription>
          Thống kê số lượng đơn hàng theo từng trạng thái
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
