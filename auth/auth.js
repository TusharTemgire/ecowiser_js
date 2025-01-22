document.addEventListener('DOMContentLoaded', function () {
  // Toggle Password Visibility
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  togglePassword.addEventListener('click', function () {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    if (confirmPasswordInput) {
      confirmPasswordInput.type = isPassword ? 'text' : 'password';
    }

    togglePassword.textContent = isPassword ? 'Hide' : 'Show';
  });

  // Login Form Submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!email || !password) {
        alert('All fields are required');
        return;
      }

      try {
        const response = await fetch('https://ecowiser-flax.vercel.app/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // alert('Login successful. Redirecting...');
          sessionStorage.setItem('sb:token', data.token);
          window.location.href = '/dashboard/product/'; 
        } else {
          alert(data.message || 'An error occurred. Please try again.');
        }
      } catch (error) {
        alert('An error occurred. Please try again.');
        console.error(error);
      }
    });
  }

  // Signup Form Submission
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirm-password').value.trim();

      if (!email || !password || !confirmPassword) {
        alert('All fields are required');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordStrengthRegex.test(password)) {
        alert(
          'Password must be at least 6 characters, with at least one uppercase letter, one number, and one special character'
        );
        return;
      }

      try {
        const response = await fetch('https://ecowiser-flax.vercel.app/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Account created successfully. Please log in.');
          signupForm.reset(); // Clear the form
        } else {
          alert(data.message || 'An error occurred. Please try again.');
        }
      } catch (error) {
        alert('An error occurred. Please try again.');
        console.error(error);
      }
    });
  }
});
