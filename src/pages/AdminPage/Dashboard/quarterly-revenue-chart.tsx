'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useGetQuarterlyRevenueByYear } from '@/queries/admin.query';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface QuarterlyRevenueChartProps {
  data: Array<{
    year: string;
    quarter: number;
    revenue: number;
  }>;
}

export function QuarterlyRevenueChart({ data }: QuarterlyRevenueChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS<'bar'> | null>(null);

  // Get current year
  const currentYear = new Date().getFullYear();

  // Start year is fixed at 2010
  const startYear = 2010;

  // Generate list of years from 2010 to current year (descending order)
  const availableYears = useMemo(() => {
    const years: number[] = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  }, [currentYear]);

  // Default to current year
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Fetch quarterly revenue for selected year
  const { data: quarterlyData, isLoading } =
    useGetQuarterlyRevenueByYear(selectedYear);

  // Use fetched data if available, otherwise use prop data filtered by year
  const displayData = useMemo(() => {
    if (quarterlyData?.data) {
      return quarterlyData.data;
    }
    if (selectedYear) {
      return data.filter((item) => parseInt(item.year) === selectedYear);
    }
    return data;
  }, [quarterlyData, selectedYear, data]);

  // Format data for display: "Q1", "Q2", etc. (since year is already selected)
  const formattedData = displayData.map((item: any) => ({
    ...item,
    label: `Q${item.quarter}`
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
    const barColor = isDark ? '#f472b6' : '#ec4899';

    // Ensure we have data for all 4 quarters
    const quarterData = [1, 2, 3, 4].map((q) => {
      const found = formattedData.find((item: any) => item.quarter === q);
      if (found) {
        // Handle both number and string types for revenue
        const revenue =
          typeof found.revenue === 'string'
            ? parseFloat(found.revenue)
            : found.revenue;
        return revenue || 0;
      }
      return 0;
    });

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: 'Doanh thu (₫)',
            data: quarterData,
            backgroundColor: barColor,
            borderRadius: 4,
            hoverBackgroundColor: isDark ? '#f91880' : '#db2777'
          }
        ]
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
              label: (context) =>
                `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} ₫`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              color: textColor,
              callback: (value) => value.toLocaleString('vi-VN')
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-900 dark:text-white">
              Doanh thu theo quý
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Doanh thu bán hàng theo quý năm
            </CardDescription>
          </div>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="relative h-[300px]">
            <canvas ref={chartRef}></canvas>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
