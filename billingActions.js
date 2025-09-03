// ================== Firebase Configuration ==================
const firebaseConfig = {
  apiKey: "AIzaSyCniD14L_jYPyhpZpAzfheddjMseT23fUw",
  authDomain: "smart-meter-2025-c7b32.firebaseapp.com",
  databaseURL: "https://smart-meter-2025-c7b32-default-rtdb.firebaseio.com",
  projectId: "smart-meter-2025-c7b32",
  storageBucket: "smart-meter-2025-c7b32.firebasestorage.app",
  messagingSenderId: "958202144045",
  appId: "1:958202144045:web:90240c1f4e525a8ede5fa4",
  measurementId: "G-NNLLT2TEZR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ================== Handle Recharge Form ==================
const rechargeForm = document.getElementById("rechargeForm");
const rechargeMessage = document.getElementById("rechargeMessage");
const billingHistory = document.getElementById("billingHistory").querySelector("tbody");

rechargeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  if (!amount || amount <= 0) {
    rechargeMessage.innerText = "Please enter a valid amount.";
    rechargeMessage.className = "error";
    return;
  }

  // Call Paystack Payment
  payWithPaystack(amount);
});

// ================== Paystack Payment ==================
function payWithPaystack(amount) {
  let handler = PaystackPop.setup({
    key: "YOUR_PAYSTACK_PUBLIC_KEY",
    email: firebase.auth().currentUser?.email || "user@example.com",
    amount: amount * 100, // Convert to kobo
    currency: "NGN",
    callback: function (response) {
      saveTransaction(response.reference, amount);
    },
    onClose: function () {
      alert("Transaction was not completed.");
    },
  });

  handler.openIframe();
}

// ================== Save Transaction to Firebase ==================
function saveTransaction(transactionId, amount) {
  const date = new Date().toLocaleString();
  const transactionData = {
    transactionId: transactionId,
    amount: amount,
    date: date,
    status: "Successful",
  };

  const newTransactionRef = db.ref("transactions").push();
  newTransactionRef
    .set(transactionData)
    .then(() => {
      rechargeMessage.innerText = "Recharge Successful!";
      rechargeMessage.className = "success";
      addTransactionRow(transactionData);
      showReceipt(transactionData);
    })
    .catch((err) => {
      console.error("Error saving transaction: ", err);
    });
}

// ================== Add Transaction to Billing Table ==================
function addTransactionRow(transaction) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${transaction.transactionId}</td>
    <td>₦${transaction.amount}</td>
    <td>${transaction.date}</td>
    <td>
      <button class="download-btn">Download</button>
      <button class="view-btn">View</button>
    </td>
  `;
  billingHistory.appendChild(row);

  attachRowActions(row, transaction);
}

// ================== Attach Actions for Download & View ==================
function attachRowActions(row, transaction) {
  // View Button
  row.querySelector(".view-btn").addEventListener("click", () => {
    document.getElementById("txnId").innerText = transaction.transactionId;
    document.getElementById("receiptAmount").innerText = transaction.amount;
    document.getElementById("receiptDate").innerText = transaction.date;
    document.getElementById("receiptModal").style.display = "flex";
  });

  // Download Button (PDF)
  row.querySelector(".download-btn").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Smart Meter Receipt", 70, 20);

    doc.setFontSize(12);
    doc.text(`Transaction ID: ${transaction.transactionId}`, 20, 40);
    doc.text(`Amount: ₦${transaction.amount}`, 20, 50);
    doc.text(`Date: ${transaction.date}`, 20, 60);
    doc.text(`Status: ${transaction.status}`, 20, 70);

    doc.setFontSize(10);
    doc.text("Thank you for using Smart Meter System!", 20, 90);

    doc.save(`Receipt_${transaction.transactionId}.pdf`);
  });
}

// ================== Close Receipt Modal ==================
document.getElementById("closeReceipt").addEventListener("click", () => {
  document.getElementById("receiptModal").style.display = "none";
});
