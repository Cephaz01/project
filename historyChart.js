document.addEventListener("DOMContentLoaded", () => {
  // ===== Toggle Mode: 'firebase' or 'demo' =====
  const DATA_MODE = "firebase"; // Change to "demo" for random data

  // ===== Chart Setup =====
  const ctxHistory = document.getElementById("historyEnergyChart").getContext("2d");
  const historyChart = new Chart(ctxHistory, {
    type: "line",
    data: {
      labels: [],  // Dynamic dates
      datasets: [{
        label: "Daily Energy Consumption (kWh)",
        data: [],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: { title: { display: true, text: "Energy (kWh)" }, beginAtZero: true }
      }
    }
  });

  // ===== Add Data to Chart =====
  function addHistoryData(date, energy) {
    historyChart.data.labels.push(date);
    historyChart.data.datasets[0].data.push(energy);

    // Keep only last 7 days
    if (historyChart.data.labels.length > 7) {
      historyChart.data.labels.shift();
      historyChart.data.datasets[0].data.shift();
    }

    historyChart.update();
  }

  // ===== Data Source =====
  if (DATA_MODE === "firebase") {
    // Fetch daily history data from Firebase
    database.ref('energy_monitor/history').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Reset chart data before adding
        historyChart.data.labels = [];
        historyChart.data.datasets[0].data = [];

        Object.keys(data).forEach(date => {
          addHistoryData(date, data[date].energy);
        });
      }
    });
  } else {
    // Generate random demo data
    const demoDates = ["Aug 25", "Aug 26", "Aug 27", "Aug 28", "Aug 29", "Aug 30", "Aug 31"];
    demoDates.forEach(date => {
      const energy = Math.floor(8 + Math.random() * 10); // 8-18 kWh
      addHistoryData(date, energy);
    });
  }
});
