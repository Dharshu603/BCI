/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { eegService } from '../services/eegDataService';
import { EEGDataPoint } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EEGChartProps {
  type: 'alpha' | 'beta' | 'gamma';
  color: string;
  label: string;
}

export const EEGChart: React.FC<EEGChartProps> = ({ type, color, label }) => {
  const [dataPoints, setDataPoints] = useState<EEGDataPoint[]>(eegService.getInitialData(30));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDataPoints((prev) => {
        const nextPoint = eegService.getNextDataPoint();
        const newData = [...prev.slice(1), nextPoint];
        return newData;
      });
    }, 200);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const chartData = {
    labels: dataPoints.map((_, i) => i.toString()),
    datasets: [
      {
        label: label,
        data: dataPoints.map((p) => p[type]),
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 10,
          },
        },
        min: 0,
        max: 100,
      },
    },
    animation: {
      duration: 0,
    },
  };

  return (
    <div className="h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};
