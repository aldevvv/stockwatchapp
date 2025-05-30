import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StokBarChart({ stokData }) {

  const limitedStokData = stokData.slice(0, 5);

  const data = {
    labels: limitedStokData.map(item => item.namaBarang),
    datasets: [
      {
        label: 'Jumlah Stok',
        data: limitedStokData.map(item => item.jumlah),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Batas Minimum',
        data: limitedStokData.map(item => item.batasMinimum),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
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
        text: 'Visualisasi Jumlah Stok dan Batas Minimum (5 Item Pertama)',
      },
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
  };

  return (
    <div style={{ height: '400px', width: '100%', marginTop: '2rem' }}> 
      <Bar data={data} options={options} />
    </div>
  );
}

export default StokBarChart;