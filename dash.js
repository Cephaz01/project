// ================= AUTH GUARD =================
auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("userEmailDisplay").textContent = `Welcome, ${user.email}`;
    loadRealtimeData();
    loadBillingHistory();
  } else {
    window.location.href = "login.html";
  }
});

// ================= LOGOUT =================
document.getElementById('logoutBtn').addEventListener('click', () => {
  auth.signOut().then(() => window.location.href = "login.html");
});

// ================= REALTIME ENERGY DATA =================
function loadRealtimeData() {
  db.ref("energyData").on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      document.getElementById("voltage").innerText = data.voltage || "--";
      document.getElementById("current").innerText = data.current || "--";
      document.getElementById("power").innerText = data.power || "--";
      document.getElementById("energy").innerText = data.energy || "--";
      document.getElementById("frequency").innerText = data.frequency || "--";
      document.getElementById("powerFactor").innerText = data.powerFactor || "--";
    }
  });

  db.ref("billingData").on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      document.getElementById("currentBill").innerText = "₦" + (data.currentBill || 0);
      document.getElementById("monthlyBill").innerText = "₦" + (data.monthlyBill || 0);
      document.getElementById("ratePerKwh").innerText = data.ratePerKwh || 0;
    }
  });
}

// ================= PAYSTACK INTEGRATION =================
document.getElementById('rechargeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const amount = document.getElementById('amount').value * 100; // kobo

  let handler = PaystackPop.setup({
    key: 'pk_live_xxxxxxxxxxxxxxxxx', // Use your real LIVE key
    email: auth.currentUser.email,
    amount: amount,
    currency: 'NGN',
    ref: 'TXN' + Math.floor(Math.random() * 1000000),
    callback: function(response) {
      const txnId = response.reference;
      const date = new Date().toLocaleString();
      const amountPaid = amount / 100;

      db.ref("transactions").push({
        txnId, amount: amountPaid, date, status: "Successful"
      });

      db.ref("billingData").update({
        currentBill: amountPaid
      });

      showReceipt(txnId, amountPaid, date);
      document.getElementById('amount').value = '';
    },
    onClose: function() { alert('Payment cancelled'); }
  });

  handler.openIframe();
});

// ================= LOAD BILLING HISTORY =================
function loadBillingHistory() {
  db.ref("transactions").on("value", (snapshot) => {
    const billingHistoryTable = document.querySelector("#billingHistory tbody");
    billingHistoryTable.innerHTML = "";
    snapshot.forEach((child) => {
      const t = child.val();
      billingHistoryTable.innerHTML += `
        <tr>
          <td>${t.txnId}</td>
          <td>₦${t.amount}</td>
          <td>${t.date}</td>
          <td>
            <button onclick="viewReceiptData('${t.txnId}', ${t.amount}, '${t.date}')">View</button>
            <button onclick="downloadReceiptData('${t.txnId}', ${t.amount}, '${t.date}')">Download</button>
          </td>
        </tr>
      `;
    });
  });
}

// ================= RECEIPT FUNCTIONS =================
function showReceipt(txnId, amount, date) {
  document.getElementById('txnId').textContent = txnId;
  document.getElementById('receiptAmount').textContent = "₦" + amount;
  document.getElementById('receiptDate').textContent = date;
  document.getElementById('receiptModal').style.display = "flex";
}

function viewReceiptData(txnId, amount, date) {
  showReceipt(txnId, amount, date);
}

function downloadReceiptData(txnId, amount, date) {
  const receiptData = `
    <h2>Recharge Receipt</h2>
    <p><strong>Transaction ID:</strong> ${txnId}</p>
    <p><strong>Amount:</strong> ₦${amount}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Status:</strong> Successful</p>
  `;
  const win = window.open('', '', 'width=400,height=600');
  win.document.write(`<html><body>${receiptData}</body></html>`);
  win.document.close();
  win.print();
}

document.getElementById('closeReceipt').onclick = () => document.getElementById('receiptModal').style.display = 'none';
document.getElementById('printReceipt').onclick = () => window.print();
document.getElementById('downloadReceipt').onclick = () => downloadReceiptData(
  document.getElementById('txnId').textContent,
  document.getElementById('receiptAmount').textContent,
  document.getElementById('receiptDate').textContent
);


firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    window.location.href = "login.html"; // Redirect if no user logged in
  } else {
    document.getElementById("userEmailDisplay").textContent = user.email; // Show user email
  }
});
// Check if user is logged in
auth.onAuthStateChanged((user) => {
  if (!user) {
    // Redirect to login page if not logged in
    window.location.href = "login.html";
  }
});

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      window.location.href = "login.html"; // redirect after logout
    })
    .catch((error) => {
      console.error("Logout Error:", error.message);
    });
});
