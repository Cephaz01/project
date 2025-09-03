// ================== Firebase Config ==================
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ================== Form & Elements ==================
const form = document.getElementById('rechargeForm');
const billingHistoryTable = document.querySelector("#billingHistory tbody");

const receiptModal = document.getElementById('receiptModal');
const txnIdField = document.getElementById('txnId');
const receiptAmountField = document.getElementById('receiptAmount');
const receiptDateField = document.getElementById('receiptDate');
const closeReceiptBtn = document.getElementById('closeReceipt');
const printReceiptBtn = document.getElementById('printReceipt');
const downloadReceiptBtn = document.getElementById('downloadReceipt');

// ================== Paystack Payment ==================
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const amount = document.getElementById('amount').value * 100; // Convert to kobo

  let handler = PaystackPop.setup({
    key: 'pk_test_b417dfecf191ef3e208ea705abd6e487eb845789', // Replace with your LIVE key
    email: 'peteradebayo57@gmail.com', // Dynamic user email can be used here
    amount: amount,
    currency: 'NGN',
    ref: 'TXN' + Math.floor(Math.random() * 1000000),
    callback: function(response) {
      const txnId = response.reference;
      const date = new Date().toLocaleString();
      const amountPaid = amount / 100;

      // Save transaction to Firebase
      db.ref("transactions").push({
        txnId: txnId,
        amount: amountPaid,
        date: date,
        status: "Successful"
      });

      // Update current bill in Firebase
      db.ref("billingData").update({
        currentBill: amountPaid
      });

      // Show receipt
      showReceipt(txnId, amountPaid, date);

      // Clear form field
      document.getElementById('amount').value = '';
    },
    onClose: function() {
      alert('Payment cancelled');
    }
  });

  handler.openIframe(); // ✅ Open Paystack popup correctly
});

// ================== Billing History ==================
db.ref("transactions").on("value", (snapshot) => {
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

// ================== Receipt Modal Functions ==================
function showReceipt(txnId, amount, date) {
  txnIdField.textContent = txnId;
  receiptAmountField.textContent = "₦" + amount;
  receiptDateField.textContent = date;
  receiptModal.style.display = "flex";
}

closeReceiptBtn.addEventListener('click', () => {
  receiptModal.style.display = 'none';
});

printReceiptBtn.addEventListener('click', () => {
  const receiptContent = document.getElementById('receiptContent').innerHTML;
  const printWindow = window.open('', '', 'width=400,height=600');
  printWindow.document.write('<html><head><title>Receipt</title></head><body>');
  printWindow.document.write(receiptContent);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
});

downloadReceiptBtn.addEventListener('click', () => {
  const txnId = txnIdField.textContent;
  const amount = receiptAmountField.textContent;
  const date = receiptDateField.textContent;
  generatePDF(txnId, amount, date);
});

// ================== Receipt from History Table ==================
function viewReceiptData(txnId, amount, date) {
  showReceipt(txnId, amount, date);
}

function downloadReceiptData(txnId, amount, date) {
  generatePDF(txnId, amount, date);
}

// ================== PDF Generator ==================
function generatePDF(txnId, amount, date) {
  const receiptData = `
    <h2>Recharge Receipt</h2>
    <p><strong>Transaction ID:</strong> ${txnId}</p>
    <p><strong>Amount:</strong> ${amount}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Status:</strong> Successful</p>
  `;

  const printWindow = window.open('', '', 'width=400,height=600');
  printWindow.document.write(`<html><body>${receiptData}</body></html>`);
  printWindow.document.close();
  printWindow.print();
}
