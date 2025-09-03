// ============== LOGIN ==================
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "Dashboard.html")
    .catch(error => document.getElementById('loginError').textContent = error.message);
});

// ============== SIGNUP ==================
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirmPassword').value;

  if (password !== confirm) {
    document.getElementById('signupError').textContent = "Passwords do not match!";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Account created successfully!");
      document.getElementById('signupForm').reset();
      document.getElementById('signupModal').style.display = 'none';
    })
    .catch(error => document.getElementById('signupError').textContent = error.message);
});

// ============== FORGOT PASSWORD ==================
document.getElementById('forgotForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('forgotEmail').value.trim();

  auth.sendPasswordResetEmail(email)
    .then(() => {
      document.getElementById('forgotMessage').textContent = "Password reset email sent!";
      setTimeout(() => {
        document.getElementById('forgotForm').reset();
        document.getElementById('forgotModal').style.display = 'none';
        document.getElementById('forgotMessage').textContent = "";
      }, 2000);
    })
    .catch(error => document.getElementById('forgotMessage').textContent = error.message);
});
