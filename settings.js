const settingsForm = document.getElementById('settingsForm');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved data on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('userName');
  const savedEmail = localStorage.getItem('userEmail');
  const savedPhone = localStorage.getItem('userPhone');
  const darkMode = localStorage.getItem('darkMode');

  if (savedName) document.getElementById('name').value = savedName;
  if (savedEmail) document.getElementById('email').value = savedEmail;
  if (savedPhone) document.getElementById('phone').value = savedPhone;

  // Load theme preference
  if (darkMode === 'enabled') {
    body.classList.add('dark');
    themeToggle.checked = true;
  }
});

// Save settings when form is submitted
settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  localStorage.setItem('userName', name);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userPhone', phone);

  alert('Settings saved successfully!');
});

// Toggle theme
themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    body.classList.add('dark');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    body.classList.remove('dark');
    localStorage.setItem('darkMode', 'disabled');
  }
});
