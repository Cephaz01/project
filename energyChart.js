document.addEventListener("DOMContentLoaded", () => {
  // ===== Toggle Mode: 'firebase' or 'demo' =====
  const DATA_MODE = "firebase"; // Change to "demo" for random data testing

  // ===== Chart Setup =====
  const energyCtx = document.getElementById("energyChart").getContext("2d");
  const energyChart = new Chart(energyCtx, {
    type: "line",
    data: {
      datasets: [{
        label: "Energy (kWh)",
        data: [],
        fill: true,
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#3498db"
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 800 },
      scales: {
        x: { type: "time", title: { display: true, text: "Time" } },
        y: { title: { display: true, text: "Energy (kWh)" }, beginAtZero: true }
      }
    }
  });

  // ===== Real-Time Card Elements =====
  const voltageEl = document.getElementById("voltage");
  const currentEl = document.getElementById("current");
  const powerEl = document.getElementById("power");
  const energyEl = document.getElementById("energy");

  // ===== Update Card Values =====
  function updateCards(voltage, current, power, energy) {
    voltageEl.textContent = `${voltage} V`;
    currentEl.textContent = `${current} A`;
    powerEl.textContent = `${power} kW`;
    energyEl.textContent = `${energy} kWh`;
  }

  // ===== Add Data to Chart =====
  function addChartData(energyValue) {
    energyChart.data.datasets[0].data.push({
      x: Date.now(),
      y: energyValue
    });

    // Keep only last 50 readings
    if (energyChart.data.datasets[0].data.length > 50) {
      energyChart.data.datasets[0].data.shift();
    }

    energyChart.update();
  }

  // ===== Data Source =====
  if (DATA_MODE === "firebase") {
    // Live Data from Firebase
    database.ref('energy_monitor/live_data').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const { voltage = 0, current = 0, power = 0, energy = 0 } = data;
        updateCards(voltage, current, power, energy);
        addChartData(energy);
      }
    });
  } else {
    // Simulated Data for Demo
    setInterval(() => {
      const voltage = (210 + Math.random() * 20).toFixed(1);
      const current = (5 + Math.random() * 3).toFixed(2);
      const power = (voltage * current / 1000).toFixed(2);
      const energyVal = (parseFloat(power) * 0.1).toFixed(2);

      updateCards(voltage, current, power, energyVal);
      addChartData(energyVal);
    }, 1000);
  }

  // ===== Sidebar Navigation =====
  const sidebarLinks = document.querySelectorAll(".sidebar ul li");
  const pages = document.querySelectorAll(".page");
  const pageTitle = document.getElementById("pageTitle");
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");

  sidebarLinks.forEach(link => {
    link.addEventListener("click", () => {
      sidebarLinks.forEach(item => item.classList.remove("active"));
      link.classList.add("active");

      pages.forEach(page => page.classList.remove("active"));

      const selectedPage = link.getAttribute("data-page");
      if (selectedPage) {
        document.getElementById(selectedPage).classList.add("active");
        pageTitle.textContent = link.innerText.trim();
      }
    });
  });

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
});
