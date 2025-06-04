// frontend/src/laporan/RiwayatStokLineChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, 
  TimeSeriesScale 
} from 'chart.js';
import 'chartjs-adapter-date-fns'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, 
);

function RiwayatStokLineChart({ chartDataPoints, itemName }) {
  if (!chartDataPoints || chartDataPoints.length === 0) {
    return <p>Tidak ada data yang cukup untuk menampilkan grafik tren.</p>;
  }

  const sortedData = [...chartDataPoints].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const data = {
    labels: sortedData.map(point => new Date(point.timestamp)), // Gunakan objek Date untuk sumbu waktu
    datasets: [
      {
        label: `Tren Jumlah Stok ${itemName || ''}`,
        data: sortedData.map(point => point.jumlahSesudah),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Grafik Tren Stok${itemName ? ' - ' + itemName : ''}`,
        font: {
            size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += context.parsed.y;
                }
                return label;
            }
        }
      }
    },
    scales: {
      x: {
        type: 'time', 
        time: {
          unit: 'day', 
          tooltipFormat: 'dd MMM yyyy HH:mm', 
          displayFormats: {
            day: 'dd MMM yy' 
          }
        },
        title: {
          display: true,
          text: 'Tanggal & Waktu'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Jumlah Stok'
        },
        ticks: {
            stepSize: 1 
        }
      }
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    }
  };

  return (
    <div className="chart-container" style={{ height: '400px', width: '100%', marginTop: '2rem', marginBottom: '2rem' }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default RiwayatStokLineChart;