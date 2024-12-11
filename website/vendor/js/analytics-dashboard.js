const API_BASE_URL = 'http://localhost:3000/analytics';
let currentBoothId = sessionStorage.getItem("currentBoothId"); 

console.log(currentBoothId)

async function fetchDashboardData() {
  try {
      console.log('Fetching data for booth:', currentBoothId);
      const metricsUrl = `${API_BASE_URL}/dashboard/${currentBoothId}`;
      console.log('Metrics URL:', metricsUrl);
      
      const [metricsResponse, salesResponse] = await Promise.all([
          fetch(metricsUrl),
          fetch(`${API_BASE_URL}/sales/${currentBoothId}?timeframe=week`)
      ]);

      if (!metricsResponse.ok) {
          throw new Error(`Metrics API failed: ${metricsResponse.status}`);
      }
      if (!salesResponse.ok) {
          throw new Error(`Sales API failed: ${salesResponse.status}`);
      }

      const metrics = await metricsResponse.json();
      const salesTrends = await salesResponse.json();

      console.log('Received metrics:', metrics);
      console.log('Received sales:', salesTrends);

      updateDashboardMetrics(metrics);
      updateSalesChart(salesTrends);
  } catch (error) {
      console.error('Error fetching dashboard data:', error);
      document.querySelector('.col-md-3:nth-child(1) h3').textContent = 'Error';
  }
}

function updateDashboardMetrics(metrics) {
  
    const lastWeekSales = metrics.total_sales || 0; 
    const lastWeekEarnings = metrics.total_earnings || 0;
    const lastWeekOrders = metrics.weekly_orders || 0;

    document.querySelector('.col-md-3:nth-child(1) h3').textContent = metrics.total_sales.toLocaleString();
    document.querySelector('.col-md-3:nth-child(2) h3').textContent = 
        `$${metrics.total_earnings.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.querySelector('.col-md-3:nth-child(3) h3').textContent = metrics.weekly_orders.toLocaleString();
    document.querySelector('.col-md-3:nth-child(4) h3').textContent = metrics.pending_orders.toLocaleString();

    const salesChange = ((metrics.total_sales - lastWeekSales) / lastWeekSales * 100).toFixed(2);
    const earningsChange = ((metrics.total_earnings - lastWeekEarnings) / lastWeekEarnings * 100).toFixed(2);
    const ordersChange = ((metrics.weekly_orders - lastWeekOrders) / lastWeekOrders * 100).toFixed(2);

    updatePercentageChange('.col-md-3:nth-child(1) p', salesChange);
    updatePercentageChange('.col-md-3:nth-child(2) p', earningsChange);
    updatePercentageChange('.col-md-3:nth-child(3) p', ordersChange);
    updatePercentageChange('.col-md-3:nth-child(4) p', -2.25); 
}

function updatePercentageChange(selector, value) {
    const element = document.querySelector(selector);
    element.textContent = `${Math.abs(value)}% Since last week`;
    element.className = value >= 0 ? 'text-success' : 'text-danger';
}

function updateSalesChart(salesData) {
    const labels = salesData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    });

    const values = salesData.map(item => item.daily_revenue);

    lineChart.data.labels = labels;
    lineChart.data.datasets[0].data = values;
    lineChart.update();
}


const lineChartCtx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(lineChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Daily Revenue',
            data: [],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => `$${value.toLocaleString()}`
                }
            }
        }
    }
});


setInterval(fetchDashboardData, 300000);

document.addEventListener('DOMContentLoaded', fetchDashboardData);