// Sidebar Navigation
const menuItems = document.querySelectorAll(".sidebar ul li[data-page]");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    menuItems.forEach(i => i.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));

    item.classList.add("active");
    const pageId = item.getAttribute("data-page");
    document.getElementById(pageId).classList.add("active");
    pageTitle.textContent = item.textContent.trim();
  });
});



// ENERGY CHART
const energyCtx = document.getElementById("energyChart").getContext("2d");
const energyChart = new Chart(energyCtx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Energy Consumption (kWh)",
      data: [12, 19, 14, 17, 23, 21],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    animation: { duration: 1500 },
    scales: { y: { beginAtZero: true } }
  }
});

// BILLING CHART
const billingCtx = document.getElementById("billingChart").getContext("2d");
const billingChart = new Chart(billingCtx, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Billing Amount (₦)",
      data: [3000, 5000, 2500, 4000, 4500, 3500],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    animation: { duration: 1200 },
    scales: { y: { beginAtZero: true } }
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const rechargeForm = document.getElementById("rechargeForm");
  const amountInput = document.getElementById("amount");
  const message = document.getElementById("rechargeMessage");
  const historyList = document.getElementById("billingHistory");

  rechargeForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const amount = amountInput.value;
    const date = new Date().toLocaleString();

    if (amount && amount > 0) {
      message.textContent = `Recharge Successful: ₦${amount}`;
      message.style.color = "green";

      // Add new row to billing history
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${date}</td>
        <td>₦${amount}</td>
        <td>Successful</td>
        <td>
          <button class="view-btn">View</button>
          <button class="download-btn">Download</button>
        </td>
      `;
      historyList.appendChild(newRow);

      // Generate PDF receipt
      generatePDFReceipt(date, amount, "Successful");

      // Clear form
      amountInput.value = "";
    } else {
      message.textContent = "Enter a valid amount!";
      message.style.color = "red";
    }
  });
});

function generatePDFReceipt(date, amount, status) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Smart Meter Receipt", 70, 20);

  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 20, 40);
  doc.text(`Amount: ₦${amount}`, 20, 50);
  doc.text(`Status: ${status}`, 20, 60);

  doc.setFontSize(10);
  doc.text("Thank you for using Smart Meter System!", 20, 80);

  doc.save(`Receipt_${date}.pdf`);
}
