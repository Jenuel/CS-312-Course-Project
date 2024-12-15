/**
 * Base URL for the analytics API.
 * This URL is used to fetch data related to booth analytics and sales trends.
 */
API_BASE_URL = "http://10.241.155.155:3000/analytics";

/**
 * Retrieves the current booth ID from session storage.
 * This ID is used to fetch specific data for the booth.
 */
let currentBoothId = sessionStorage.getItem("currentBoothId");

console.log(currentBoothId); // Log the current booth ID for debugging purposes

/**
 * Fetches dashboard data for the current booth, including metrics and sales trends.
 * Updates the UI elements with the fetched data.
 */
async function fetchDashboardData() {
  try {
    console.log("Fetching data for booth:", currentBoothId);

    // Construct API URLs for metrics and sales trends
    const metricsUrl = `${API_BASE_URL}/dashboard/${currentBoothId}`;
    console.log("Metrics URL:", metricsUrl);

    // Fetch metrics and sales trends in parallel
    const [metricsResponse, salesResponse] = await Promise.all([
      fetch(metricsUrl),
      fetch(`${API_BASE_URL}/sales/${currentBoothId}?timeframe=week`),
    ]);

    // Handle API response errors
    if (!metricsResponse.ok) {
      throw new Error(`Metrics API failed: ${metricsResponse.status}`);
    }
    if (!salesResponse.ok) {
      throw new Error(`Sales API failed: ${salesResponse.status}`);
    }

    // Parse JSON data from responses
    const metrics = await metricsResponse.json();
    const salesTrends = await salesResponse.json();

    console.log("Received metrics:", metrics);
    console.log("Received sales:", salesTrends);

    // Update the dashboard with fetched data
    updateDashboardMetrics(metrics);
    updateSalesChart(salesTrends);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);

    // Display error message in the first metrics card
    document.querySelector(".col-md-3:nth-child(1) h3").textContent = "Error";
  }
}

/**
 * Updates the dashboard metrics displayed on the UI.
 * @param {Object} metrics - The metrics data fetched from the API.
 */
function updateDashboardMetrics(metrics) {
  const lastWeekSales = metrics.total_sales || 0;
  const lastWeekEarnings = metrics.total_earnings || 0;
  const lastWeekOrders = metrics.weekly_orders || 0;

  // Update the metrics cards with fetched data
  document.querySelector(".col-md-3:nth-child(1) h3").textContent =
    metrics.total_sales.toLocaleString();
  document.querySelector(
    ".col-md-3:nth-child(2) h3"
  ).textContent = `$${metrics.total_earnings.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;
  document.querySelector(".col-md-3:nth-child(3) h3").textContent =
    metrics.weekly_orders.toLocaleString();
  document.querySelector(".col-md-3:nth-child(4) h3").textContent =
    metrics.pending_orders.toLocaleString();

  // Calculate percentage changes from last week
  const salesChange = (
    ((metrics.total_sales - lastWeekSales) / lastWeekSales) *
    100
  ).toFixed(2);
  const earningsChange = (
    ((metrics.total_earnings - lastWeekEarnings) / lastWeekEarnings) *
    100
  ).toFixed(2);
  const ordersChange = (
    ((metrics.weekly_orders - lastWeekOrders) / lastWeekOrders) *
    100
  ).toFixed(2);

  // Update percentage change indicators
  updatePercentageChange(".col-md-3:nth-child(1) p", salesChange);
  updatePercentageChange(".col-md-3:nth-child(2) p", earningsChange);
  updatePercentageChange(".col-md-3:nth-child(3) p", ordersChange);
  updatePercentageChange(".col-md-3:nth-child(4) p", -2.25); // Example placeholder value
}

/**
 * Updates the percentage change indicator for a specific metric.
 * @param {string} selector - CSS selector for the element to update.
 * @param {number} value - Percentage change value.
 */
function updatePercentageChange(selector, value) {
  const element = document.querySelector(selector);
  element.textContent = `${Math.abs(value)}% Since last week`;
  element.className = value >= 0 ? "text-success" : "text-danger";
}

/**
 * Updates the sales trends chart with fetched sales data.
 * @param {Array} salesData - Array of daily sales data.
 */
function updateSalesChart(salesData) {
  // Extract labels (day of the week) and values (daily revenue)
  const labels = salesData.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  });

  const values = salesData.map((item) => item.daily_revenue);

  // Update chart data and refresh the chart
  lineChart.data.labels = labels;
  lineChart.data.datasets[0].data = values;
  lineChart.update();
}

/**
 * Initializes a line chart for displaying daily revenue trends.
 */
const lineChartCtx = document.getElementById("lineChart").getContext("2d");
const lineChart = new Chart(lineChartCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Daily Revenue",
        data: [],
        borderColor: "blue",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        tension: 0.1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  },
});

/**
 * Fetch dashboard data every 5 minutes (300,000 milliseconds).
 */
setInterval(fetchDashboardData, 300000);

/**
 * Fetch dashboard data when the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", fetchDashboardData);
