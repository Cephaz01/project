document.addEventListener("DOMContentLoaded", () => {
  // ===== Mode: 'firebase' or 'demo' =====
  const DATA_MODE = "firebase"; // Change to "demo" for testing without live data

  // ===== Firebase Reference =====
  const db = firebase.database(); // Use initialized Firebase from your main script

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
      animation: { duration: 500 },
      plugins: {
        legend: { display: true }
      },
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
  const frequencyEl = document.getElementById("frequency");
  const powerFactorEl = document.getElementById("powerFactor");
  const connectionStatusEl = document.getElementById("connectionStatus");

  // ===== Update Cards =====
  function updateCards(voltage, current, power, energy, frequency, powerFactor) {
    voltageEl.textContent = `${voltage} V`;
    currentEl.textContent = `${current} A`;
    powerEl.textContent = `${power} kW`;
    energyEl.textContent = `${energy} kWh`;
    frequencyEl.textContent = `${frequency} Hz`;
    powerFactorEl.textContent = powerFactor;
  }

  // ===== Add Data to Chart =====
  function addChartData(energyValue) {
    energyChart.data.datasets[0].data.push({
      x: Date.now(),
      y: energyValue
    });

    if (energyChart.data.datasets[0].data.length > 50) {
      energyChart.data.datasets[0].data.shift();
    }

    energyChart.update();
  }

  // ===== Data Source =====
  if (DATA_MODE === "firebase") {
    db.ref("energy_monitor/live_data").on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const {
          voltage = 0,
          current = 0,
          power = 0,
          energy = 0,
          frequency = 0,
          powerFactor = 0
        } = data;

        updateCards(voltage, current, power, energy, frequency, powerFactor);
        addChartData(energy);

        connectionStatusEl.innerHTML = `<span style="color:green;">Connected</span>`;
      } else {
        connectionStatusEl.innerHTML = `<span style="color:red;">No Data</span>`;
      }
    });
  } else {
    // Demo Mode: Generate Random Values
    setInterval(() => {
      const voltage = (210 + Math.random() * 20).toFixed(1);
      const current = (5 + Math.random() * 3).toFixed(2);
      const power = (voltage * current / 1000).toFixed(2);
      const energyVal = (parseFloat(power) * 0.1).toFixed(2);
      const frequency = (49 + Math.random() * 2).toFixed(2);
      const powerFactor = (0.85 + Math.random() * 0.1).toFixed(2);

      updateCards(voltage, current, power, energyVal, frequency, powerFactor);
      addChartData(energyVal);

      connectionStatusEl.innerHTML = `<span style="color:orange;">Demo Mode</span>`;
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
