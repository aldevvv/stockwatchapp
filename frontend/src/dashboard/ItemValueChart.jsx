import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ItemValueChart({ chartData }) {
  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  const data = {
    labels: chartData.map(item => item.namaBarang),
    datasets: [
      {
        label: 'Total Nilai Stok',
        data: chartData.map(item => item.totalValue),
        backgroundColor: 'rgba(22, 163, 74, 0.7)',
        borderColor: 'rgba(22, 163, 74, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) {
              label += formatRupiah(context.parsed.x);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          callback: function(value) {
            if (value >= 1000000) {
                return 'Rp ' + (value / 1000000) + ' Jt';
            }
            if (value >= 1000) {
                return 'Rp ' + (value / 1000) + ' Rb';
            }
            return 'Rp ' + value;
          },
          font: {
            size: 10
          }
        }
      },
      y: {
        ticks: {
            font: {
                size: 10
            }
        }
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <Bar options={options} data={data} />
    </div>
  );
}

export default ItemValueChart;