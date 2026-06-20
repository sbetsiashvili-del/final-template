(function () {
  // Already logged in — show message with link, no auto-redirect
  if (localStorage.getItem('user')) {
    document.getElementById('login-form').hidden = true;
    document.getElementById('already-logged-in').hidden = false;
    return;
  }

  // Login form submit — user gesture, window.location IS allowed
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name-input').value.trim();
    const errorEl = document.getElementById('login-error');

    if (!name) {
      errorEl.textContent = 'გთხოვთ შეიყვანოთ სახელი.';
      errorEl.hidden = false;
      return;
    }

    errorEl.hidden = true;
    localStorage.setItem('user', name);
    document.cookie = 'authorized=true; path=/';

    // User-gesture redirect — allowed on file://
    window.location.href = 'index.html';
  });
})();
