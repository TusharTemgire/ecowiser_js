function isAuthenticated() {
  const token = sessionStorage.getItem("sb:token");
  if (!token) {
    console.warn("No token found in sessionStorage.");
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Decoded token payload:", payload);

    const currentTime = Date.now() / 1000;
    if (payload.exp < currentTime) {
      console.warn("Token has expired. Removing token from sessionStorage.");
      sessionStorage.removeItem("sb:token");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
}

function protectRoute() {
  const path = window.location.pathname;

  console.log("Checking if route is protected...");
  if (!isAuthenticated() && !path.includes("/auth/login.html")) {
    console.warn("User is not authenticated. Redirecting to login.");
    window.location.href = "/auth/login.html";
  }
}

function redirectToSpecificDashboard() {
  const path = window.location.pathname;

  console.log("Checking if redirection to specific dashboard is required...");
  if (path === "/dashboard/" || path === "/dashboard") {
    console.log("Redirecting to default dashboard section.");
    window.location.href = "/dashboard/brand/index.html";
  }
}

function redirectIfAuthenticated() {
  const path = window.location.pathname;

  console.log("Checking if user is authenticated and accessing login page...");
  if (isAuthenticated() && (path.includes("/auth/login.html") || path.includes("/auth/"))) {
    console.log("User already authenticated. Redirecting to dashboard.");
    window.location.href = "/dashboard/brand/index.html";
  }
}

function logoutUser() {
  console.log("Logging out user...");
  sessionStorage.removeItem("sb:token");
  window.location.href = "/auth/login.html";
}

function decodeJWT() {
  const token = sessionStorage.getItem("sb:token");
  if (token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }
  console.warn("No token found for decoding.");
  return null;
}

function preventAccessToLogin() {
  const path = window.location.pathname;

  console.log("Checking if login/signup access needs to be prevented...");
  if ((path === "/auth/login.html" || path === "/auth" || path === "/auth/") && isAuthenticated()) {
    console.log("User already authenticated. Redirecting to dashboard.");
    window.location.href = "/dashboard/brand/index.html";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed.");

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    console.log("Attaching logout event listener.");
    logoutBtn.addEventListener("click", logoutUser);
  } else {
    console.warn("Logout button not found in the DOM.");
  }

  // Redirect logic
  const path = window.location.pathname;
  if (path.includes("/dashboard")) {
    protectRoute();
    redirectToSpecificDashboard();
  }

  if (path.includes("/auth/")) {
    preventAccessToLogin();
  }
});

console.log("Authentication status:", isAuthenticated());
